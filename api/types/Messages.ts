
import Message from "./message";

export type BaseMessage = {
    message_id: number;
    from: number;
    sent_to: number;
    message: string;
    timestamp: string;
}

export interface MessagingMessage extends Message {
    id: number;
    type: string;
    use: 'PUT' | 'GET';
    data: {
        AllMessages: BaseMessage[];
    };
}