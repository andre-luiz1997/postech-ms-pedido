import * as dotenv from "dotenv"
import { emptyToUndefined } from "../utils"
// dotenv.config({path: '../../../.env'})
dotenv.config()

export default {
  NODE_ENV: emptyToUndefined(process.env.NODE_ENV),
  PORT: emptyToUndefined(process.env.PORT),
  mongo: {
    MONGO_USER: emptyToUndefined(process.env.MONGO_USER),
    MONGO_PW: emptyToUndefined(process.env.MONGO_PW),
    MONGO_DATABASE: emptyToUndefined(process.env.MONGO_DATABASE),
    MONGO_PORT: emptyToUndefined(process.env.MONGO_PORT),
    MONGO_HOST: emptyToUndefined(process.env.MONGO_HOST),
  },
  dynamo: {
    DYNAMO_REGION: emptyToUndefined(process.env.DYNAMO_REGION),
    DYNAMO_SECRET_ACCESS_KEY: emptyToUndefined(process.env.DYNAMO_SECRET_ACCESS_KEY),
    DYNAMO_ACCESS_KEY_ID: emptyToUndefined(process.env.DYNAMO_ACCESS_KEY_ID),
    DYNAMO_PORT: emptyToUndefined(process.env.DYNAMO_PORT),
    DYNAMO_HOST: emptyToUndefined(process.env.DYNAMO_HOST),
    DYNAMO_VAR: emptyToUndefined(process.env.DYNAMO_VAR),
  },
  aws: {
    AWS_ACCESS_KEY_ID: emptyToUndefined(process.env.AWS_ACCESS_KEY_ID),
    AWS_SECRET_ACCESS_KEY: emptyToUndefined(process.env.AWS_SECRET_ACCESS_KEY),
    AWS_REGION: emptyToUndefined(process.env.AWS_REGION),
  },
  queue: {
    host: emptyToUndefined(process.env.QUEUE_HOST),
    port: emptyToUndefined(process.env.QUEUE_PORT),
    user: emptyToUndefined(process.env.QUEUE_USER),
    password: emptyToUndefined(process.env.QUEUE_PASSWORD),
    queues: {
      queue1: emptyToUndefined(process.env.QUEUE_1),
      queue2: emptyToUndefined(process.env.QUEUE_2),
      queue3: emptyToUndefined(process.env.QUEUE_3),
      queue4: emptyToUndefined(process.env.QUEUE_4),
    }
  }
}
