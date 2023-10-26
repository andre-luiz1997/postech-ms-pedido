import * as dynamoose from "dynamoose"
import config from "src/shared/config";
import Connection, { ConnectionProps } from "src/shared/ports/connection"

export class DynamoConnection implements Connection {
  connection: typeof dynamoose
  props: ConnectionProps

  constructor(props?: ConnectionProps) {
    this.props = props;
  }

  async connect(): Promise<boolean> {

    const ddb = new dynamoose.aws.ddb.DynamoDB({      
      region: config.aws.AWS_REGION,
      credentials: {
        accessKeyId: config.aws.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.aws.AWS_SECRET_ACCESS_KEY,
      },
      endpoint: "",
    })
    dynamoose.aws.ddb.set(ddb);
    
    return true;
  }
}
