import React, { useState } from 'react';
import { Body1, Body1Stronger, Skeleton, Input, Button, DrawerHeaderTitle } from "@fluentui/react-components";
import { isEqual } from "lodash";
import { BaseMessage } from "./Messages.tsx";
import axios from "axios";


async function addMessageHandler(setAllMessages, allMessages: BaseMessage[], new_message_data: string, activeConversation: number, setMessageData) {
    function getCurrentTime(): String { // Get current date and time
        let now = new Date();
        let num_hours = now.getHours();
        let num_minutes = now.getMinutes();
        // Format hours and minutes 
        let hours = (num_hours < 10 ? '0' : '') + num_hours;
        let minutes = (num_minutes < 10 ? '0' : '') + num_minutes;
        let currentTime = hours + ':' + minutes;

        return currentTime;
    }
    const new_message = {
        message_id: allMessages.length,
        use: 'PUT',
        data: {
            from: -1,
            sent_to: activeConversation,
            message: new_message_data,
            timestamp: getCurrentTime()
        }
    };
    // Update then send messages
    const new_messages = [...allMessages, new_message];
    setAllMessages(new_messages);
    setMessageData('');
    console.log('new_messages', new_messages)
    try {
        await axios.post('/api/messages', new_messages);
    } catch (e) {
        console.error(e);
    }
}


function MessageDisplay({ setAllMessages, allMessages, conversations, activeConversation }) {
    const [message_data, setMessageData] = useState('');

    if (activeConversation === -1) {
        return (
            <div style={{ width: "100%" }}>
                <Body1>Select an astronaut to view messages</Body1>
            </div>
        );
    }
    const astro = activeConversation != -2 ? `Astronaut ${activeConversation}` : 'Astronaut Groupchat';
    return (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#0A0A0A", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px", width: "100%", height: "70px", backgroundColor: "#141414", borderColor: "#444444", borderStyle: "solid", borderWidth: "0px 0px 1px 0px" }}>
                <DrawerHeaderTitle>
                    {astro}
                </DrawerHeaderTitle>
            </div>
            <div style={{ flexGrow: "1" }}>
                {
                    conversations.get(activeConversation)?.map((message, index) => {
                        const from = message.data?.from;
                        const sent_to = message.data?.sent_to;
                        const message_text = message.data?.message;
                        const astronaut = from === -1 ? 'LMCC' : from;
                        const timestamp = message.data?.timestamp;
                        return (
                            <div key={index}>
                                <Body1>{timestamp}</Body1>
                                <Body1Stronger>{astronaut}: {message_text}</Body1Stronger>
                            </div>
                        );
                    })
                }
            </div>
            <div style={{ borderTop: "1px solid #666666", height: "130px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "start", paddingTop: "20px", width: "95%", height: "80%" }}>
                    <Input
                        type="text"
                        id={"message-details"}
                        value={message_data}
                        onChange={(e) => {
                            setMessageData(e.target.value);
                        }}
                        style={{ flexGrow: 1 }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                addMessageHandler(setAllMessages, allMessages, message_data, activeConversation, setMessageData);
                            }
                        }}
                    />
                    <Button onClick={() => {
                        addMessageHandler(setAllMessages, allMessages, message_data, activeConversation, setMessageData);
                    }}>Send Message</Button>
                </div>
            </div>
        </div >
    );
}

export default MessageDisplay;
