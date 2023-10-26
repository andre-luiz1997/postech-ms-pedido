import * as express from "express";
import * as bodyParser from "body-parser";
import config from "@shared/config";
import routes from "./routes";
import dynamoose from 'dynamoose';
import {MongoConnection} from "../database/mongodb/adapters/MongoConnection";
import { DynamoConnection } from "../database/dynamodb/localstack/adapters/DynamoConnection";
import { ClienteModel } from "../database/dynamodb/localstack/cliente/models/cliente.dynamo";

const isDynamoDatabase = config.NODE_ENV == "aws"
const isMongoDatabase = config.NODE_ENV == "production" || config.NODE_ENV == "debug"
const PORT = config.PORT || 3000;
var cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

function configureRoutes() {
  app.use(routes);
  
  app.listen(PORT, () => {
    console.log(`Server escutando na porta ${PORT}`);
  });
}

function configureMongo() {
  const client = new MongoConnection({
    database: config.mongo.MONGO_DATABASE,
    user: config.mongo.MONGO_USER,
    password: config.mongo.MONGO_PW,
    port: +config.mongo.MONGO_PORT,
    host: config.mongo.MONGO_HOST
  });
  return client.connect().then(() => configureRoutes())
}

function configureDynamo() {
  const _config = {
    database: config.dynamo.DYNAMO_REGION,
    user: config.dynamo.DYNAMO_ACCESS_KEY_ID,
    password: config.dynamo.DYNAMO_SECRET_ACCESS_KEY,
    port: +config.dynamo.DYNAMO_PORT,
    host: config.dynamo.DYNAMO_HOST
  }
  const client = new DynamoConnection(_config);
  return client.connect().then(() => {
    configureRoutes()
    ClienteModel.scan().exec().then(res => console.log(res)).catch(err => console.log(err))
  })
}

async function bootstrap() {
  if(isMongoDatabase) return configureMongo()
  if(isDynamoDatabase) return configureDynamo()
  return configureRoutes();
}

bootstrap();
