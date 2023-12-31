import config from "@shared/config";
import { ClienteController } from "@domain/cliente/controllers/ClienteController"
import { ItemController } from "@domain/item/controllers/ItemController"
import { ClienteMongoRepository } from "@infra/database/mongodb/cliente/repositories/clientesMongo.repository"
import { ItemMongoRepository } from "@infra/database/mongodb/item/repositories/itensMongo.repository"
import { PedidoController } from "@domain/pedido/controllers/PedidoController"
import { PedidoMongoRepository } from "@infra/database/mongodb/pedido/repositories/pedidosMongo.repository"
import { ClienteMemoriaRepository } from "src/infra/database/memory/cliente/repositories/clientesMemoria.repository"
import { ItemMemoriaRepository } from "src/infra/database/memory/item/repositories/itemMemoria.repository"
import { PedidoMemoriaRepository } from "src/infra/database/memory/pedido/repositories/pedidosMemoria.repository"
import { ClienteDynamoRepository } from "src/infra/database/dynamodb/localstack/cliente/repositories/clientesDynamo.repository";
import { ItemDynamoRepository } from "src/infra/database/dynamodb/localstack/item/repositories/itemDynamo.repository";
import { PedidoDynamoRepository } from "src/infra/database/dynamodb/localstack/pedido/repositories/pedidoDynamo.repository";

export class ApiController {
  private static instance: ApiController
  clienteController: ClienteController
  itemController: ItemController
  pedidoController: PedidoController

  constructor() {
    const isDynamoDatabase = config.NODE_ENV == "aws"
    const isMongoDatabase = config.NODE_ENV == "production" || config.NODE_ENV == "debug"

    let clienteRepo
    let itemRepo
    let pedidoRepo

    if(isDynamoDatabase) {
      clienteRepo = new ClienteDynamoRepository();
      itemRepo = new ItemDynamoRepository();
      pedidoRepo = new PedidoDynamoRepository();
    } else {
      clienteRepo = !isMongoDatabase ? new ClienteMemoriaRepository() : new ClienteMongoRepository();
      itemRepo = !isMongoDatabase ? new ItemMemoriaRepository() : new ItemMongoRepository();
      pedidoRepo = !isMongoDatabase ? new PedidoMemoriaRepository() : new PedidoMongoRepository(clienteRepo, itemRepo);
    }
    
    this.clienteController = new ClienteController(clienteRepo)
    this.itemController = new ItemController(itemRepo)
    this.pedidoController = new PedidoController(pedidoRepo)
  }

  public static get Instance() {
    return this.instance || (this.instance = new this())
  }
}
