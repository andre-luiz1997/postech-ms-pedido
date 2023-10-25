import * as dynamoose from "dynamoose"
import Connection, { ConnectionProps } from "src/shared/ports/connection"

export class DynamoConnection implements Connection {
  connection: typeof dynamoose
  props: ConnectionProps

  constructor(props?: ConnectionProps) {
    this.props = props;
  }

  async connect(): Promise<boolean> {

    const ddb = new dynamoose.aws.ddb.DynamoDB({      
      region: 'us-east-1',
      credentials: {
        accessKeyId: "localstack",
        secretAccessKey: "localstack",
      },
      endpoint: {
        port: 4566,
        hostname: "localstack_main",
        path: '',
        protocol: 'http:'
      },
    })
    dynamoose.aws.ddb.set(ddb);
    
    return true;
  }
}
