export interface ConnectionProps {
  database: string;
  user?: string;
  password?: string;
  host?: string;
  port?: number;
}

export default abstract class Connection {
  static props: ConnectionProps;
  abstract connect(): void;
}
