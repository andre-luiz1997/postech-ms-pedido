import {
  BuscarUmProps,
  CriarProps,
  DeletarProps,
  EditarProps,
  IsUniqueManyProps,
  IsUniqueProps,
  Repository,
} from "@shared/ports/repository"
import { RegistroExistenteException } from "@shared/exceptions/registroExistente.exception"
import { Item } from "@domain/item/entities/item"
import { RegistroInexistenteException } from "@shared/exceptions/registroInexistente.exception"
import { ItemModel } from "@infra/database/mongodb/item/models/item.mongo"
import mongoose from "mongoose"
import { MongoConnection } from "../../adapters/MongoConnection"

export class ItemMongoRepository implements Repository<Item> {
  async listar(queryProps?: any): Promise<Item[]> {
    if(queryProps.deletedAt) delete queryProps.deletedAt
    return ItemModel.find({ deletedAt: null, ...queryProps }, {}, {session: queryProps.transaction})
  }

  async deletar({ _id, transaction }: DeletarProps): Promise<boolean> {
    const item = await this.buscarUm({ query: { _id }, transaction })
    if (!item) throw new RegistroInexistenteException({ campo: "id" })
    item.deletedAt = new Date()
    await ItemModel.updateOne({ _id }, item, {session: transaction})
    return true
  }

  async criar({ item, transaction }: CriarProps<Item>): Promise<Item> {
    // const isUnique = await this.isUnique({
    //   props: Object.entries(item).map(([key, value]) => {
    //     return { prop: key, value }
    //   }),
    //   transaction
    // })
    // if (!isUnique) throw new RegistroExistenteException({ mensagem: "Já existe um item com os parâmetros informados" })
    item._id = new mongoose.Types.ObjectId()
    await ItemModel.create([item], {}, {session: transaction});
    return this.buscarUm({query: {query: {_id: item._id}}, transaction})
  }

  async editar({ _id, item, transaction }: EditarProps<Item>): Promise<Item> {
    const query: BuscarUmProps = {
      query: {
        _id,
      },
    }
    if(transaction) query.transaction = transaction
    const _item = await this.buscarUm(query)
    if (!_item) throw new RegistroInexistenteException({ campo: "id" })
    await ItemModel.updateOne({ _id }, item, {session: transaction})
    return this.buscarUm({query: {_id: _item._id}, transaction })
  }

  async buscarUm(props: BuscarUmProps): Promise<Item | null> {
    if(!props.query) props.query = {query: {}};
    if(!props.query.query) props.query.query = {};
    if (!props.query?.query?.deletedAt) {
      props.query.query.deletedAt = null;
    }
    return ItemModel.findOne(props.query.query,{},{session: props.transaction})
  }

  async isUnique(props: IsUniqueManyProps): Promise<boolean> {
    let query: BuscarUmProps = {
      query: props.props.reduce((result: any, item) => {
        result[item.prop] = item.value
        return result
      }, {}),
    }
    if (props.ignoreId) query.query._id = { $ne: props.ignoreId }
    if(props.transaction) query.transaction = props.transaction
    const item = await this.buscarUm(query)
    return item === null
  }

  async startTransaction() {
    return new Promise<any>((resolve) => resolve(null));
    // const session = await MongoConnection.Instance.connection.startSession();
    // session.startTransaction({
    //   session
    // })
    // return session;
  }

  async commitTransaction(transaction: mongoose.mongo.ClientSession) {
    if(!transaction) return;
    if(!transaction.inTransaction()) return;
    return transaction.commitTransaction();
  }

  async rollbackTransaction(transaction: mongoose.mongo.ClientSession) {
    if(!transaction) return;
    if(!transaction.inTransaction()) return;
    return transaction.abortTransaction() 
  }

  async inTransaction(transaction: mongoose.mongo.ClientSession, callback: () => Promise<any>) {
    if(!transaction) return callback();
    return MongoConnection.Instance.connection.transaction(callback);
  }
}
