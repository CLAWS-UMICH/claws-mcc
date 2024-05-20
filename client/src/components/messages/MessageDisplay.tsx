import React, { useState } from 'react';
import { Body1, Body1Stronger, Skeleton, Input, Button, DrawerHeaderTitle, makeStyles } from "@fluentui/react-components";
import { isEqual } from "lodash";
import axios from "axios";

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

function DisplayHeader({ astro }) {
    return (
        <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px", width: "100%", height: "70px", backgroundColor: "#141414", borderColor: "#444444", borderStyle: "solid", borderWidth: "0px 0px 1px 0px" }}>
            <DrawerHeaderTitle>
                {astro}
            </DrawerHeaderTitle>
        </div>
    );
}

function MessageInput({ setMessageData, message_data, addMessageHandler, setAllMessages, allMessages, activeConversation }) {
    return (
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
    );
}

function MessageFeed({ conversations, activeConversation }) {
    return (
        <div style={{ height: "80%", overflowY: "scroll" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px" }}>
                {
                    conversations.get(activeConversation)?.map((message, index) => {
                        return (
                            <MessageBubble key={index} message={message} />
                        )
                    })
                }
            </div>
        </div>
    );
}


function ContactImage({ astro }) {
    const circleStyle = {
        width: "30px",
        height: "30px",
        lineHeight: "500px",
        borderRadius: "50%",
        fontSize: "50px",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#006704",
        border: "2px solid #4CAB50",
    }
    return (
        <div style={circleStyle}>
            <div style={{ fontSize: "13px" }}><b>A{astro}</b></div>
        </div>
    );
}

function MessageBubble({ message }: { message: BaseMessage }) {
    const timestamp = message.data?.timestamp;
    const from = message.data?.from;
    const sent_to = message.data?.sent_to;
    const message_text = message.data?.message;

    // Convert timestamp to AM/PM Format
    let timestamp_text = "";
    if (!timestamp) {
        timestamp_text = "";
    } else {
        let time = timestamp?.split(":");
        let hours = parseInt(time[0]);
        let minutes = parseInt(time[1]);
        let ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        let minutes_text = minutes < 10 ? '0' + minutes : minutes;
        timestamp_text = hours + ':' + minutes_text + ' ' + ampm;
    }

    const bubbleStyle = {
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "95%",
        alignSelf: from === -1 ? "flex-end" : "flex-start",
        backgroundColor: from === -1 ? "#0060D3" : "#2b2b2b",
        color: "white",
        wordWrap: 'break-word' as 'break-word',
    };

    // LMCC Message
    if (from == -1) {
        return (
            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
                    <Body1 style={{ alignSelf: "flex-end", color: "#999999", fontWeight: "bold" }}>{timestamp_text}</Body1>
                    <Body1Stronger style={bubbleStyle}>{message_text}</Body1Stronger>
                </div>
            </div>


        );
    } else {
        // Astronaut Message
        return (
            <div style={{ width: "100%", display: "flex", gap: "10px", alignItems: "center" }}>
                <ContactImage astro={from} />
                <div style={{ width: "40%", display: "flex", flexDirection: "column" }}>
                    <Body1 style={{ alignSelf: "flex-start", color: "#999999", fontWeight: "bold" }}>{timestamp_text}</Body1>
                    <Body1Stronger style={bubbleStyle}>{message_text}</Body1Stronger>
                </div>
            </div>
        );
    }
}



function MessageDisplay({ setAllMessages, allMessages, conversations, activeConversation }) {
    const [message_data, setMessageData] = useState('');

    if (activeConversation === -1) {
        return (
            <div style={{ width: "100%", height: "100%", backgroundColor: "#0A0A0A", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px", width: "100%", height: "70px", backgroundColor: "#141414", borderColor: "#444444", borderStyle: "solid", borderWidth: "0px 0px 1px 0px" }}>
                    <DrawerHeaderTitle>
                        Select An Astronaut
                    </DrawerHeaderTitle>
                </div>
            </div>
        );
    }
    const astro = activeConversation != -2 ? `Astronaut ${activeConversation}` : 'Astronaut Groupchat';
    return (
        <div style={{ width: "100%", height: "100%", backgroundColor: "#0A0A0A", display: "flex", flexDirection: "column" }}>
            <DisplayHeader astro={astro} />
            <MessageFeed conversations={conversations} activeConversation={activeConversation} />
            <MessageInput setMessageData={setMessageData} message_data={message_data} addMessageHandler={addMessageHandler} setAllMessages={setAllMessages} allMessages={allMessages} activeConversation={activeConversation} />
        </div >
    );
}

export default MessageDisplay;
