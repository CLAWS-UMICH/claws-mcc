import React, {useEffect, useReducer, useState} from "react";
import {Divider, InlineDrawer, DrawerHeader, Button, DrawerHeaderTitle} from "@fluentui/react-components";
import useDynamicWebSocket from "../../hooks/useWebSocket.tsx";
import {ReadyState} from 'react-use-websocket';


export type MessageState = {
    messages?: string[];
}

export type MessageAction =
    { type: 'set', payload: Message[] } | // Should only be used by ServerListener
    { type: 'add', payload: Message }

export interface Message {
    message_id: number;
    use: 'PUT' | 'GET';
    data?: {
        message_id: number;
        sent_to: number;
        message: string;
        from: number;
    };
}
    
const initialState: MessageState = {messages: []}

export const messageReducer = (state: MessageState, action: MessageAction): MessageState => {
    switch (action.type) {
        case 'set':
        default:
            return state;
    }
}

export const Messages: React.FC = () => {
    const [state, dispatch] = useReducer(messageReducer, initialState)
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const {sendMessage, lastMessage, readyState} = useDynamicWebSocket({
        onOpen: () => sendMessage(JSON.stringify({type: 'GET_MESSAGES'}))
    });
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage.data));
            dispatch({type: 'set', payload: JSON.parse(lastMessage.data).data});
        }
    }, [lastMessage, setMessageHistory]);

    return (
        <div style={{display: "flex", height:"100vh", backgroundColor: "#000000"}}>
            <InlineDrawer style={{backgroundColor: "#0F0F0F"}} className={'drawer'} separator open>
                <DrawerHeader style={{backgroundColor: "#141414"}}>
                    <DrawerHeaderTitle>
                        Messages
                    </DrawerHeaderTitle>
                </DrawerHeader>
            </InlineDrawer>
            
        </div>
    );
}

export default Messages;
