import {
    BuscarUmProps,
    CriarProps,
    DeletarProps,
    EditarProps,
    IsUniqueManyProps,
    Repository,
  } from "src/shared/ports/repository"
  import { RegistroExistenteException } from "src/shared/exceptions/registroExistente.exception"
  import { RegistroInexistenteException } from "src/shared/exceptions/registroInexistente.exception"
import { Pagamento, PagamentoProps } from "src/domain/pagamento/entities/pagamento"
import { PagamentoModel } from "../models/pagamento.dynamo"
  
  export class PagamentoDynamoRepository implements Repository<Pagamento> {
    async editar({_id, item}: EditarProps<Pagamento>): Promise<Pagamento> {
      const query = {
        query: {
          _id,
        },
      }
      const _cliente = await this.buscarUm(query)
      if (!_cliente) throw new RegistroInexistenteException({ campo: "id" })
      await PagamentoModel.updateOne({ _id }, item)
      return this.buscarUm(query)
    }
  
    async isUnique(props: IsUniqueManyProps): Promise<boolean> {
      let query: BuscarUmProps = {
        query: props.props.reduce((result: any, item) => {
          result[item.prop] = item.value
          return result
        }, {}),
      }
      if (props.ignoreId) query.query._id = { $ne: props.ignoreId }
      const item = await this.buscarUm(query)
      return item === null
    }
  
    async deletar({_id}: DeletarProps): Promise<boolean> {
      const item = await this.buscarUm({ query: { _id } })
      if (!item) throw new RegistroInexistenteException({ campo: "id" })
      item.deletedAt = new Date()
      await PagamentoModel.updateOne({ _id }, item)
      return true
    }
  
    async criar({ item }: CriarProps<Pagamento>): Promise<Pagamento> {
      const isUnique = await this.isUnique({
          props: Object.entries(item).map(([key, value]) => {
            return { prop: key, value }
          }),
        })
        if (!isUnique) throw new RegistroExistenteException({ mensagem: "Já existe um item com os parâmetros informados" })
      if(!item._id) item.generateId();
      const _item = await PagamentoModel.create(item);
      await _item.save();
      return this.buscarUm({query: { _id: _item._id }});
    }
    
    async listar(): Promise<Pagamento[]> {
      return new Promise<Pagamento[]>(async (resolve, reject) => {
        PagamentoModel.scan().all().exec((err, data) => {
          if(err) reject(err);
          resolve(data.map(item => new Pagamento(item as unknown as PagamentoProps)));
        })
      })
    }
  
    async buscarUm(props: BuscarUmProps): Promise<Pagamento> {
      return new Promise<Pagamento>(async (resolve, reject) => {
        PagamentoModel.get(props?.query?._id).then((data) => resolve(new Pagamento(data as unknown as PagamentoProps))).catch((err) => reject(err))
      });
    }
  }
  