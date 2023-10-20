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

export class ClienteDynamoRepository implements Repository<Cliente> {
  private tableName = "Clientes"
  constructor() {}

  private buildFromCliente(item: Cliente) {
    if (!item._id) item.generateId()
    const dynamoItem: Record<string, AttributeValue> = {
    }
    if (item.nome) dynamoItem.nome = { S: item.nome }
    if (item.email) dynamoItem.email = { S: item.email }
    return dynamoItem
  }

  editar(props: EditarProps<Cliente>): Promise<Cliente> {
    throw new Error("Method not implemented.")
  }
  isUnique?(props: IsUniqueProps | IsUniqueManyProps): Promise<boolean> {
    throw new Error("Method not implemented.")
  }
  deletar(props: DeletarProps): Promise<boolean> {
    throw new Error("Method not implemented.")
  }

  async criar({ item }: CriarProps<Cliente>): Promise<Cliente> {
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
    // return new Promise(async (resolve, reject) => {
    //   console.log(this.buildFromCliente(item))
    //   const command = new PutItemCommand({
    //     TableName: this.tableName,
    //     Item: this.buildFromCliente(item),
    //     ReturnConsumedCapacity: "TOTAL",
    //   })
    //   this.dynamoClient
    //     .send(command)
    //     .then((data) => {
    //       console.log("clientes", data)
    //       resolve(undefined)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       reject(err)
    //     })
    // })
  }
  listar(queryProps?: Object): Promise<Cliente[]> {
    return new Promise<Cliente[]>(async (resolve, reject) => {
      ClienteModel.scan().all().exec((err, data) => {
        console.log(err, data)
        if(err) reject(err);
        resolve(data.map(item => new Cliente(item as ClienteProps)));
      })
    })
  }
  buscarUm(props: BuscarUmProps): Promise<Cliente> {
    return new Promise<Cliente>(async (resolve, reject) => {
      ClienteModel.get(props?.query?._id).then((data) => resolve(new Cliente(data as ClienteProps))).catch((err) => reject(err))
    });
  }
}
