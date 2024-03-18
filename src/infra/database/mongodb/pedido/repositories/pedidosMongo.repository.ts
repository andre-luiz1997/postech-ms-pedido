import mongoose, { AggregateOptions, PipelineStage } from "mongoose"
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
import { Pedido, PedidoItemProps, statusPedidos } from "@domain/pedido/entities/pedido"
import { RegistroInexistenteException } from "@shared/exceptions/registroInexistente.exception"
import { PedidoModel } from "@infra/database/mongodb/pedido/models/pedido.mongo"
import { Cliente } from "@domain/cliente/entities/cliente"
import { Item } from "@domain/item/entities/item"
import { MongoConnection } from "../../adapters/MongoConnection"

export class PedidoMongoRepository implements Repository<Pedido> {
  private ordemPipeline: PipelineStage[] = [
    {
      $addFields: {
        statusOrder: {
          $indexOfArray: [statusPedidos.reverse(), "$status"]
        }
      }
    },
    {
      $sort: {
        statusOrder: 1
      }
    }
  ]

  constructor(
    private readonly clienteRepository: Repository<Cliente>,
    private readonly itemRepository: Repository<Item>
  ) { }

  private async validarForeignKeys(item: Pedido, transaction?: any) {
    const cliente = await this.clienteRepository.buscarUm({ query: { _id: item.cliente._id }, transaction })
    if (!cliente)
      throw new RegistroInexistenteException({ mensagem: `Cliente com id ${item.cliente?._id} não encontrado` })
    item.cliente = cliente
    const mapItens: PedidoItemProps[] = []
    for (let index = 0; index < item.itens.length; index++) {
      const i = item.itens[index]
      const _item = await this.itemRepository.buscarUm({ query: { _id: i.item._id }, transaction })
      if (!_item) throw new RegistroInexistenteException({ mensagem: `Item com id ${i.item._id} não encontrado` })
      mapItens.push({
        item: _item,
        qtd: i.qtd,
      })
    }
    item.itens = mapItens
    return
  }

  async listar(queryProps?: any): Promise<Pedido[]> {
    if (queryProps.deletedAt) delete queryProps.deletedAt
    return PedidoModel
      .aggregate([
        {
          $match: { deletedAt: null, ...queryProps }
        },
        {
          $lookup: {
            from: 'clientes',
            localField: 'cliente',
            foreignField: '_id',
            as: 'cliente'
          }
        },
        {
          $unwind: '$itens'
        },
        {
          $lookup: {
            from: 'items',
            localField: 'itens.item',
            foreignField: '_id',
            as: 'itens.item'
          }
        },
        {
          $unwind: '$itens.item'
        },
        {
          $group: {
            _id: '$_id',
            cliente: { $first: '$cliente' },
            status: { $first: '$status' },
            valor: { $first: '$valor' },
            itens: {
              $push: '$itens'
            }
          }
        },
        ...this.ordemPipeline,
      ])
    // return PedidoModel.find({ deletedAt: null, ...queryProps }).populate('cliente').populate({path: 'itens', populate: 'item'})
  }

  async deletar({ _id, transaction }: DeletarProps): Promise<boolean> {
    const item = await this.buscarUm({ query: { _id } })
    if (!item) throw new RegistroInexistenteException({ campo: "id" })
    item.deletedAt = new Date()
    await PedidoModel.updateOne({ _id }, item, {session: transaction})
    return true
  }

  async criar({ item, transaction }: CriarProps<Pedido>): Promise<Pedido> {
    await this.validarForeignKeys(item)
    if (!item.valor || isNaN(item.valor)) {
      item.valor = item.calcularValor()
    }

    if (!item._id) {
      item._id = new mongoose.Types.ObjectId()
    }

    const _item = await PedidoModel.create([item],{},{session: transaction})
    return this.buscarUm({ query: { _id: item._id }, transaction })
  }

  async editar({ _id, item, transaction }: EditarProps<Pedido>): Promise<Pedido> {
    const query: BuscarUmProps = {
      query: {
        _id,
      },
    }
    if(transaction) query.transaction = transaction
    const _pedido = await this.buscarUm(query)
    if (!_pedido) throw new RegistroInexistenteException({ campo: "id" })
    await this.validarForeignKeys(item, transaction)
    if (!item.valor || isNaN(item.valor)) {
      item.valor = item.calcularValor()
    }

    await PedidoModel.updateOne({ _id }, item, {session: transaction})
    return this.buscarUm(query)
  }

  async buscarUm(props: BuscarUmProps): Promise<Pedido | null> {
    if(!props.query) props.query = {query: {}};
    if(!props.query.query) props.query.query = {};
    if (!props.query?.query?.deletedAt) {
      props.query.query.deletedAt = null;
    }
    return PedidoModel.findOne(props.query.query).populate('cliente').populate({ path: 'itens', populate: 'item' }).session(props.transaction)
  }

  async isUnique(props: IsUniqueManyProps): Promise<boolean> {
    let query: BuscarUmProps = {
      query: props.props.reduce((result: any, item) => {
        result[item.prop] = item.value
        return result
      }, {}),
    }
    if (props.ignoreId) query.query._id = { $ne: props.ignoreId }
    if (props.transaction) query.transaction = props.transaction;
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
