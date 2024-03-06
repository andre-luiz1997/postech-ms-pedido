import { emptyToUndefined } from "src/shared/utils";
import { IMessagingQueue, IMessagingQueueProps } from "../ports/queue";
import * as rabbitMQ from 'amqplib/callback_api';
import config from "src/shared/config";

export class RabbitQueue implements IMessagingQueue {
    static connectionString: string;
    static connection?: rabbitMQ.Connection;
    private static instance?: RabbitQueue;
    static props: IMessagingQueueProps;
    static channel?: rabbitMQ.Channel;

    public static get Instance() {
        return this.instance || (this.instance = new this())
      }

    private constructor() {
        RabbitQueue.props = {
            url: config.queue.url,
            host: config.queue.host,
            port: config.queue.port,
            password: config.queue.password,
            user: config.queue.user,
        } 
        this.createConnectionString();
    }

    private createConnectionString() {
        const {host, password, user, port, url} = RabbitQueue.props;
        if(url) {
            RabbitQueue.connectionString = url;
            return;
        }
        RabbitQueue.connectionString = `${host}:${port}`;
        if (emptyToUndefined(user) && emptyToUndefined(password)) {
            RabbitQueue.connectionString = `${user}:${password}@${RabbitQueue.connectionString}`;
        }
        RabbitQueue.connectionString = `amqp://` + RabbitQueue.connectionString
    }


    async connect(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            console.log('rabbit queue', RabbitQueue.connectionString);
            rabbitMQ.connect(RabbitQueue.connectionString, (err, connection) => {
                if(err) reject(err);
                RabbitQueue.connection = connection;
                RabbitQueue.createChannel().then(() => {
                    resolve(true);
                })
            })
        });
    }

    private static async createChannel() {
        return new Promise<void>((resolve, reject) => {
            RabbitQueue.connection.createChannel((err, channel) => {
                if(err) reject(err);
                RabbitQueue.channel = channel;
                resolve();
            })
        })
    }

    addQueue(queue_name: string) {
        RabbitQueue.channel.assertQueue(queue_name, {durable: true});
        RabbitQueue.channel.prefetch(0);
    }

    async subscribeToQueue(queue_name: string, callback: Function) {
        if(!RabbitQueue.channel) await this.connect();
        RabbitQueue.channel.consume(queue_name, (data) => {
            const res = data.content.toString();
            console.log('received data from queue', queue_name, JSON.parse(res));
            callback(res)
        }, {noAck: true})
    }

    publishToQueue (queue_name: string, data: string) {
        console.log('publish data to queue', queue_name, data);
        RabbitQueue.channel.sendToQueue(queue_name, Buffer.from(data));
    }
}