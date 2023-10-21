import { Cliente, ClienteProps } from "src/domain/cliente/entities/cliente"
import {
  BuscarUmProps,
  CriarProps,
  DeletarProps,
  EditarProps,
  IsUniqueManyProps,
  IsUniqueProps,
  Repository,
} from "src/shared/ports/repository"
import { DynamoConnection } from "../../adapters/DynamoConnection"
import { AttributeValue, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb"
import { RegistroExistenteException } from "src/shared/exceptions/registroExistente.exception"
import { ClienteModel } from "../models/cliente.dynamo"
import { RegistroInexistenteException } from "src/shared/exceptions/registroInexistente.exception"

export class ClienteDynamoRepository implements Repository<Cliente> {
  async editar({_id, item}: EditarProps<Cliente>): Promise<Cliente> {
    const query = {
      query: {
        _id,
      },
    }
    const _cliente = await this.buscarUm(query)
    if (!_cliente) throw new RegistroInexistenteException({ campo: "id" })
    await ClienteModel.updateOne({ _id }, item)
    return this.buscarUm(query)
  }

  async isUnique(props: IsUniqueProps): Promise<boolean> {
    let query: BuscarUmProps = {
      query: {
        [props.prop]: props.value,
      },
    }
    const item = await this.buscarUm(query)
    return item === null
  }

  async deletar({_id}: DeletarProps): Promise<boolean> {
    const item = await this.buscarUm({ query: { _id } })
    if (!item) throw new RegistroInexistenteException({ campo: "id" })
    item.deletedAt = new Date()
    await ClienteModel.updateOne({ _id }, item)
    return true
  }

  async criar({ item }: CriarProps<Cliente>): Promise<Cliente> {
    const isEmailUnique =
      item.email &&
      (await this.isUnique({
        prop: "email",
        value: item.email,
      }))
    if (isEmailUnique === false)
      throw new RegistroExistenteException({
        mensagem: `Já existe um registro com email ${item.email}`,
      })
    const isCpfUnique =
      item.cpf &&
      (await this.isUnique({
        prop: "cpf",
        value: item.cpf,
      }))
    if (isCpfUnique === false)
      throw new RegistroExistenteException({
        mensagem: `Já existe um registro com cpf ${item.cpf}`,
      })
    const isNomeUnique =
      item.nome &&
      (await this.isUnique({
        prop: "nome",
        value: item.nome,
      }))
    if (isNomeUnique === false)
      throw new RegistroExistenteException({
        mensagem: `Já existe um registro com nome ${item.nome}`,
      })
    const query = item._id && {
      query: {
        _id: item._id
      }
    }
    if (item._id && await this.buscarUm({query})) throw new RegistroExistenteException({})
    if(!item._id) item.generateId();
    const _item = await ClienteModel.create(item);
    await _item.save();
    return this.buscarUm({query: { _id: _item._id }});
  }
  
  async listar(): Promise<Cliente[]> {
    return new Promise<Cliente[]>(async (resolve, reject) => {
      ClienteModel.scan().all().exec((err, data) => {
        if(err) reject(err);
        resolve(data.map(item => new Cliente(item as ClienteProps)));
      })
    })
  }

  async buscarUm(props: BuscarUmProps): Promise<Cliente> {
    return new Promise<Cliente>(async (resolve, reject) => {
      ClienteModel.get(props?.query?._id).then((data) => resolve(new Cliente(data as ClienteProps))).catch((err) => reject(err))
    });
  }
}
