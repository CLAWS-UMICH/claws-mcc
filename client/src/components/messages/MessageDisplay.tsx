import React, {useState} from 'react';
import {Body1, Body1Stronger, Skeleton, Input, Button} from "@fluentui/react-components";
import {isEqual} from "lodash";
import {BaseMessage} from "./Messages.tsx";
import axios from "axios";


function addMessageHandler(setAllMessages, allMessages: BaseMessage[], new_message_data: string, activeConversation: number) {
    console.log('addMessageHandler', new_message_data);
    const new_message = {
        message_id: allMessages.length,
        use: 'PUT',
        data: {
            from: -1,
            sent_to: activeConversation,
            message: new_message_data
        }
    };
    // Update then send messages
    const new_messages = [...allMessages, new_message];
    setAllMessages(new_messages);
    console.log('new_messages', new_messages)
    try {
        axios.post('/api/messages', new_messages);
    } catch (e) {
        console.error(e);
    }
}


function MessageDisplay({ setAllMessages, allMessages, conversations, activeConversation }) {
    const [message_data, setMessageData] = useState('');

    if(activeConversation === -1) {
        return (
            <div>
                <Body1>Select an astronaut to view messages</Body1>
            </div>
        );
    }
    return (
        <div>
            <div>
                {
                    conversations.get(activeConversation)?.map((message, index) => {
                        const from = message.data?.from;
                        const sent_to = message.data?.sent_to;
                        const message_text = message.data?.message;
                        const astronaut = from === -1 ? 'LMCC' : from;
                        return (
                            <div key={index}>
                                <Body1Stronger>{astronaut}: {message_text}</Body1Stronger>
                            </div>
                        );
                    })
                }
            </div>
            <div>
                <Input
                    type="text"
                    id={"message-details"}
                    onChange={(e) => { 
                        setMessageData(e.target.value);
                    }}
                />
                <Button onClick={() => {
                    addMessageHandler(setAllMessages, allMessages, message_data, activeConversation);
                }}>Send Message</Button>
            </div>
        </div>
    );
}

export default MessageDisplay;