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
import { Webhook, WebhookProps } from "src/domain/webhook/entities/webhook"
import { WebhookModel } from "../models/webhook.dynamo"
  
  export class WebhookDynamoRepository implements Repository<Webhook> {
    async editar({_id, item}: EditarProps<Webhook>): Promise<Webhook> {
      const query = {
        query: {
          _id,
        },
      }
      const _cliente = await this.buscarUm(query)
      if (!_cliente) throw new RegistroInexistenteException({ campo: "id" })
      await WebhookModel.updateOne({ _id }, item)
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
      await WebhookModel.updateOne({ _id }, item)
      return true
    }
  
    async criar({ item }: CriarProps<Webhook>): Promise<Webhook> {
      const isUnique = await this.isUnique({
          props: Object.entries(item).map(([key, value]) => {
            return { prop: key, value }
          }),
        })
        if (!isUnique) throw new RegistroExistenteException({ mensagem: "Já existe um item com os parâmetros informados" })
      if(!item._id) item.generateId();
      const _item = await WebhookModel.create(item);
      await _item.save();
      return this.buscarUm({query: { _id: _item._id }});
    }
    
    async listar(): Promise<Webhook[]> {
      return new Promise<Webhook[]>(async (resolve, reject) => {
        WebhookModel.scan().all().exec((err, data) => {
          if(err) reject(err);
          resolve(data.map(item => new Webhook(item as unknown as WebhookProps)));
        })
      })
    }
  
    async buscarUm(props: BuscarUmProps): Promise<Webhook> {
      return new Promise<Webhook>(async (resolve, reject) => {
        WebhookModel.get(props?.query?._id).then((data) => resolve(new Webhook(data as unknown as WebhookProps))).catch((err) => reject(err))
      });
    }
  }
  