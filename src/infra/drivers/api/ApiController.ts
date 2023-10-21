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
import { PagamentoMemoriaRepository } from "src/infra/database/memory/pagamento/repositories/pagamentosMemoria.repository"
import { PagamentosMongoRepository } from "src/infra/database/mongodb/pagamento/repositories/pagamentosMongo.repository"
import { PagamentoController } from "src/domain/pagamento/controllers/PagamentoController"
import GatewayPagamento from "src/domain/pagamento/ports/gatewayPagamento"
import { GatewayPagamentoMock } from "src/domain/pagamento/adapters/gatewayPagamentoMock.adapter"
import { WebhookController } from "src/domain/webhook/controllers/WebhookController"
import { WebhooksMongoRepository } from "src/infra/database/mongodb/pagamento/repositories/webhookMongoRepository.repository"
import { WebhookMemoriaRepository } from "src/infra/database/memory/pagamento/repositories/webhookMemoria.repository"
import { WebhookGatewayAdapter, WebhookGatewayType } from "src/domain/webhook/adapters/gatewayWebhook.adapter"
import { ClienteDynamoRepository } from "src/infra/database/dynamodb/localstack/cliente/repositories/clientesDynamo.repository";
import { ItemDynamoRepository } from "src/infra/database/dynamodb/localstack/item/repositories/itemDynamo.repository";
import { PedidoDynamoRepository } from "src/infra/database/dynamodb/localstack/pedido/repositories/pedidoDynamo.repository";
import { PagamentoDynamoRepository } from "src/infra/database/dynamodb/localstack/pagamento/repositories/pagamentoDynamo.repository";
import { WebhookDynamoRepository } from "src/infra/database/dynamodb/localstack/pedido/repositories/webhookDynamoRepository.repository";

export class ApiController {
  private static instance: ApiController
  clienteController: ClienteController
  itemController: ItemController
  pedidoController: PedidoController
  pagamentoController: PagamentoController
  gateway: GatewayPagamento
  webhookController: WebhookController
  webhookGateway: WebhookGatewayAdapter

  constructor() {
    const isDynamoDatabase = config.NODE_ENV == "aws"
    const isMongoDatabase = config.NODE_ENV == "production" || config.NODE_ENV == "debug"
    const debug = config.NODE_ENV == 'production' || config.NODE_ENV == 'debug';

    let clienteRepo
    let itemRepo
    let pedidoRepo
    let pagamentosRepo
    let webhookRepo
    let webhookGateway = WebhookGatewayType.GatewayWebhookMock;

    if(isDynamoDatabase) {
      clienteRepo = new ClienteDynamoRepository();
      itemRepo = new ItemDynamoRepository();
      pedidoRepo = new PedidoDynamoRepository();
      pagamentosRepo = new PagamentoDynamoRepository();
      webhookRepo = new WebhookDynamoRepository();
    } else {
      clienteRepo = debug ? new ClienteMemoriaRepository() : new ClienteMongoRepository();
      itemRepo = debug ? new ItemMemoriaRepository() : new ItemMongoRepository();
      pedidoRepo = debug ? new PedidoMemoriaRepository() : new PedidoMongoRepository(clienteRepo, itemRepo);
      pagamentosRepo = debug ? new PagamentoMemoriaRepository() : new PagamentosMongoRepository(pedidoRepo);
      webhookRepo = debug ? new WebhookMemoriaRepository() : new WebhooksMongoRepository(pedidoRepo);
    }
    
    this.webhookGateway = new WebhookGatewayAdapter(webhookGateway, webhookRepo);
    this.clienteController = new ClienteController(clienteRepo)
    this.itemController = new ItemController(itemRepo)
    this.pedidoController = new PedidoController(pedidoRepo)
    this.gateway = new GatewayPagamentoMock(pedidoRepo, pagamentosRepo);
    this.pagamentoController = new PagamentoController(pagamentosRepo, pedidoRepo, this.gateway, this.webhookGateway)
    this.webhookController = new WebhookController(webhookRepo, this.webhookGateway)
  }

  public static get Instance() {
    return this.instance || (this.instance = new this())
  }
}
