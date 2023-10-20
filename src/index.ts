import { Cliente, ClienteProps } from "@domain/cliente/entities/cliente"
import { ClienteMemoriaRepository } from "@infra/database/memory/cliente/repositories/clientesMemoria.repository"
import { ClienteSeeder } from "@infra/database/memory/cliente/seeders/cliente.seeder"
import { Item, ItemProps } from "@domain/item/entities/item"
import { ItemMemoriaRepository } from "@infra/database/memory/item/repositories/itemMemoria.repository"
import { ItemSeeder } from "@infra/database/memory/item/seeders/item.seeder"
import { JsonDataReader } from "@shared/adapters/jsonDataReader"
import { MongoConnection } from "@infra/database/mongodb/adapters/MongoConnection"
import { ClienteMongoRepository } from "@infra/database/mongodb/cliente/repositories/clientesMongo.repository"
import { Repository } from "./shared/ports/repository"
import { ItemMongoRepository } from "./infra/database/mongodb/item/repositories/itensMongo.repository"
import { DynamoConnection } from "./infra/database/dynamodb/localstack/adapters/DynamoConnection"
import config from "@shared/config"
import { ListTablesCommand } from "@aws-sdk/client-dynamodb"
import { ClienteDynamoRepository } from "./infra/database/dynamodb/localstack/cliente/repositories/clientesDynamo.repository"

const isDynamoDatabase = config.NODE_ENV == "aws"
const isMemoryDatabase = config.NODE_ENV == "production" || config.NODE_ENV == "debug"
console.log({isDynamoDatabase})
let clientesRepository: Repository<Cliente>
let itensRepository: Repository<Item>

// DATAREADERS ===================================================================
async function bootstrapMemoryDatabase() {
  const clientesDataReader = new JsonDataReader<ClienteProps[]>()
  const itensDataReader = new JsonDataReader<ItemProps[]>()
  clientesRepository = ClienteMemoriaRepository.Instance
  itensRepository = ItemMemoriaRepository.Instance
  const clientesSeeder = new ClienteSeeder(clientesRepository, clientesDataReader)
  const itensSeeder = new ItemSeeder(itensRepository, itensDataReader)
  console.time("seeding")
  console.log("SEEDING STARTED...")
  await clientesSeeder.seed()
  await itensSeeder.seed()
  console.log(`SEEDING FINISHED...`)
  console.timeEnd("seeding")
}

async function bootstrapMongoDatabase() {
  console.log(config)
  const client = new MongoConnection({
    user: config.mongo.MONGO_USER,
    password: config.mongo.MONGO_PW,
    database: config.mongo.MONGO_DATABASE,
    host: config.mongo.MONGO_HOST,
    port: +config.mongo.MONGO_PORT,
  })
  await client.connect()
  clientesRepository = new ClienteMongoRepository()
  itensRepository = new ItemMongoRepository()
}

async function boostrapDynamoDatabase() {
  const client = new DynamoConnection({
    host: config.dynamo.DYNAMO_HOST,
    port: +config.dynamo.DYNAMO_PORT,
    database: config.dynamo.DYNAMO_DATABASE,
    user: config.dynamo.DYNAMO_ACCESS_KEY_ID,
    password: config.dynamo.DYNAMO_SECRET_ACCESS_KEY,
  });
  await client.connect();
  clientesRepository = new ClienteDynamoRepository();
  const item = new Cliente({
    nome: 'André Luiz',
    email: 'andre@appmarketing.com.br',
  });
  await clientesRepository.criar({item});
  console.log(await clientesRepository.listar())
}

// SEEDERS =======================================================================

async function bootstrap() {
  try {
    if (isMemoryDatabase) bootstrapMemoryDatabase()
    else if (isDynamoDatabase) boostrapDynamoDatabase()
    else bootstrapMongoDatabase()
  } catch (error) {
    console.log(error)
  }
}

bootstrap()
