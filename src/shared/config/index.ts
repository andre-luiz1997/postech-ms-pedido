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
    DYNAMO_PORT: emptyToUndefined(process.env.DYNAMO_PORT),
    DYNAMO_HOST: emptyToUndefined(process.env.DYNAMO_HOST),
  },
  aws: {
    AWS_ACCESS_KEY_ID: emptyToUndefined(process.env.AWS_ACCESS_KEY_ID),
    AWS_SECRET_ACCESS_KEY: emptyToUndefined(process.env.AWS_SECRET_ACCESS_KEY),
    AWS_REGION: emptyToUndefined(process.env.AWS_REGION),
  }
};
