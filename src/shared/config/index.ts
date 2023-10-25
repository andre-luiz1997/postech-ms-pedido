import * as dotenv from 'dotenv'
import { emptyToUndefined } from '../utils';
dotenv.config({path: '../../../.env'})
// dotenv.config()

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
    DYNAMO_ACCESS_KEY_ID: emptyToUndefined(process.env.DYNAMO_ACCESS_KEY_ID),
    DYNAMO_SECRET_ACCESS_KEY: emptyToUndefined(process.env.DYNAMO_SECRET_ACCESS_KEY),
    DYNAMO_DATABASE: emptyToUndefined(process.env.DYNAMO_DATABASE),
    DYNAMO_PORT: emptyToUndefined(process.env.DYNAMO_PORT),
    DYNAMO_HOST: emptyToUndefined(process.env.DYNAMO_HOST),
  }
};
