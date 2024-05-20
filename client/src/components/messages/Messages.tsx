import React, { useEffect, useReducer, useState } from "react";
import { Divider, InlineDrawer, DrawerHeader, Button, DrawerHeaderTitle, Input } from "@fluentui/react-components";
import useDynamicWebSocket from "../../hooks/useWebSocket.tsx";
import { ReadyState } from 'react-use-websocket';
// import Message from "../../../../api/types/message.ts";
import { add, set } from "lodash";
import axios from "axios";
import { useAstronaut } from "../waypoints/WaypointManager.tsx";
import MessageDrawer from "./MessageDrawer.tsx";
import MessageDisplay from "./MessageDisplay.tsx";
import { Backpack12Filled } from "@fluentui/react-icons";

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

export type MessageAction =
    { type: 'set', payload: BaseMessage[] } | // Should only be used by ServerListener
    { type: 'add', payload: BaseMessage }

function createConversations(setConversations, messages: BaseMessage[]) {
    // Map from astronaut ID to messages
    const conversations = new Map();
    for (const message of messages) {
        const from = message.data?.from;
        const sent_to = message.data?.sent_to;

        // Only include messages including LMCC (-1)
        if (from !== -1 && sent_to !== -1) {
            continue;
        }

        const astro = from === -1 ? sent_to : from;
        if (!conversations.has(astro)) {
            conversations.set(astro, []);
        }
        conversations.get(astro).push(message);
    }

    // sort conversations by message_id
    conversations.forEach((messages, astro) => {
        messages.sort((a, b) => a.message_id - b.message_id);
    });

    console.log('conversations', conversations);
    setConversations(conversations);
    return conversations;
}


export const Messages: React.FC = () => {
    const [allMessages, setAllMessages] = useState<BaseMessage[]>([]);
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const { sendMessage, lastMessage, readyState } = useDynamicWebSocket({
        onOpen: () => sendMessage(JSON.stringify({ type: 'GET_MESSAGES' }))
    });

    const [conversations, setConversations] = useState<Map<number, BaseMessage[]>>(new Map());
    const [activeConversation, setActiveConversation] = useState<number>(-1);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage.data));
            const messages = JSON.parse(lastMessage.data).data;
            setAllMessages(messages);
            createConversations(setConversations, messages);
        }
    }, [lastMessage, setMessageHistory]);
    return (
        <div style={{ display: "flex", height: "100vh", width: "100%", backgroundColor: "#000000", border: "1px solid #444444", overflowX: "hidden" }}>
            <InlineDrawer style={{ backgroundColor: "#0F0F0F", width: "250px" }} separator open>
                <DrawerHeader style={{ height: "70px", backgroundColor: "#141414", borderColor: "#444444", borderStyle: "solid", borderWidth: "0px 1px 1px 0px" }}>
                    <DrawerHeaderTitle>
                        Messages
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <h2 style={{ width: "100%" }}>
                    <MessageDrawer
                        messages={allMessages}
                        conversations={conversations}
                        setActiveConversation={setActiveConversation}
                        activeConversation={activeConversation}
                    />
                </h2>
            </InlineDrawer>

            <div style={{ flexGrow: "1" }}>
                <MessageDisplay
                    setAllMessages={setAllMessages}
                    allMessages={allMessages}
                    conversations={conversations}
                    activeConversation={activeConversation}
                />
            </div>
        </div>
    );
}

export default Messages;
