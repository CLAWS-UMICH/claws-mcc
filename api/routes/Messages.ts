import { Request, Response } from "express";
import Base, { RouteEvent } from "../Base";
import { BaseMessage, MessagingMessage } from "../types/Messages";
import Message from "../types/message";
import { Collection, Db, Document, InsertManyResult, WithId } from "mongodb";
import Logger from "../core/logger";

export interface ResponseBody {
    error: boolean,
    message: string,
    data: BaseMessage[]
}

export default class Messages extends Base {
    public routes = [
        {
            path: '/api/messages',
            method: 'post',
            handler: this.addMessage.bind(this),
        }
    ];
    public events: RouteEvent[] = [
        {
            type: 'GET_MESSAGES',
            handler: this.sendMessages.bind(this),
        },
        {
            type: 'MESSAGING',
            handler: this.handleReceiveMessaging.bind(this),
        }
    ]
    private collection: Collection<BaseMessage>
    private logger = new Logger('Messages');

    constructor(db: Db, collection?: Collection<BaseMessage>) {
        super(db);
        // If no collection is passed in, use the default one
        this.collection = collection || db.collection<BaseMessage>('messages');
    }

    async handleReceiveMessaging(data: MessagingMessage) {
        const new_messages = data.data?.AllMessages;
        if (!new_messages.length) {
            this.logger.error('No messages received');
            return;
        }

        // just delete all the messages and insert the new ones
        await this.collection.deleteMany({});
        await this.collection.insertMany(new_messages);
        this.logger.info('Received new messages');

        const messageId = -1;
        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'MESSAGING',
            use: 'GET',
            data: new_messages,
        });
    }

    async sendMessages(payload: any) {
        const { platform = 'AR' } = payload;

        this.logger.info('receiving messages request')
        const allMessages = this.collection.find();
        const data = await allMessages.toArray();
        const message_id = -1;
        this.dispatch('FRONTEND', {
            id: message_id,
            type: 'MESSAGING',
            use: 'GET',
            data: data,
        })
        this.updateARMessages(message_id, data, platform);
    }

    async addMessage(req: Request, res: Response<ResponseBody>) {
        const current_messages = await this.collection.find().toArray();
        const new_messages = req.body as BaseMessage[];
        // diff the current messages with the new messages
        const diff = new_messages.filter(new_message => {
            return !current_messages.some(current_message => {
                return current_message.message_id === new_message.message_id;
            });
        });
        // insert the diff into the collection
        const result = await this.collection.insertMany(diff);
        if (result.acknowledged === false) {
            const response: ResponseBody = { error: true, message: 'error adding message', data: new_messages }
            res.send(response);
            return response;
        }

        const message_id = -1;
        this.dispatch('FRONTEND', {
            id: message_id,
            type: 'MESSAGING',
            use: 'GET',
            data: new_messages,
        })
        this.updateARMessages(message_id, new_messages);
        const response: ResponseBody = {
            error: false,
            message: 'message added',
            data: new_messages
        }
        console.log()
        res.send(response);
        return response;
    }

    // Requests waypoints from AR
    // Updates AR with the most recent waypoints. Assumes that the input data is the most up-to-date
    private updateARMessages(messageId: number, data: BaseMessage[], platform?: string): void {
        const newMessage: MessagingMessage = {
            id: messageId,
            type: 'MESSAGING',
            use: 'PUT',
            data: {
                AllMessages: data
            }
        }

        if (!platform || platform === 'AR') {
            this.dispatch("AR", newMessage)
        }
    }
}