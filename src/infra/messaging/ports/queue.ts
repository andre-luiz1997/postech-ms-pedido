
export interface IMessagingQueueProps {
    host: string;
    port: string;
    user: string;
    password: string;
}

export class IMessagingQueue {
    static connectionString: string;
    static props: IMessagingQueueProps;
    static connection?: any;
    static channel?: any;
    connect: () => Promise<boolean>;
    addQueue: (queue_name: string) => void;
    subscribeToQueue: (queue_name: string, callback: Function) => void;
    publishToQueue: (queue_name: string, data: string) => void;
}