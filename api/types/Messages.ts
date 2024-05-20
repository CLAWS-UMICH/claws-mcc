
import Message from "./message";

export type BaseMessage = {
    message_id: number;
    use: 'PUT' | 'GET'; // these are the only two methods AR expects
    data?: {
        from: number
        sent_to: number
        message: string
        timestamp: string
    };
}

export interface MessagingMessage extends Message {
    id: number;
    type: string;
    data: {
        AllMessages: BaseMessage[];
    };
}