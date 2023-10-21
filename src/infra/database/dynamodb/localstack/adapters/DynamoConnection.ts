import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import * as dynamoose from "dynamoose"
import Connection, { ConnectionProps } from "src/shared/ports/connection"

export class DynamoConnection implements Connection {
  connection: typeof dynamoose
  props: ConnectionProps

  constructor(props?: ConnectionProps) {
    this.props = props;
  }

  async connect(): Promise<boolean> {
    console.log({
      region: this.props.database,
      credentials: {
        accessKeyId: "localstack",
        secretAccessKey: "localstack",
      },
    })
    const ddb = new dynamoose.aws.ddb.DynamoDB({
      region: this.props.database,
      credentials: {
        accessKeyId: "localstack",
        secretAccessKey: "localstack",
      },
      endpoint: `${this.props.host}:${this.props.port}`,
    })
    dynamoose.aws.ddb.set(ddb);
    return true;
  }
}
