import React, { useCallback } from 'react';
import { useAstronaut } from "../waypoints/WaypointManager.tsx";
import { Body1, Body1Stronger, Skeleton, CompoundButton } from "@fluentui/react-components";
import { isEqual } from "lodash";
import { makeStyles } from '@fluentui/react-components';
import { BaseMessage } from "../../../../api/types/Messages.ts";

const useStyles = makeStyles({
    imageText: {
        fontSize: "13px",
        position: "absolute",
        marginTop: "-25.5px",
        marginLeft: "8px"
    }
});

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



function MessageDrawer({ messages, conversations, setActiveConversation, activeConversation }) {
    const [hoveredButton, setHoveredButton] = React.useState(null);

    const handleMouseEnter = (index) => {
        setHoveredButton(index);
    };

    const handleMouseLeave = () => {
        setHoveredButton(null);
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: "center", paddingTop: "15px" }}>
            {Array.from(conversations.keys()).map((key, index) => {
                const astro = key as number;

                let recent_message = conversations.get(astro)[conversations.get(astro).length - 1].data.message;
                let preview_length = 25;
                if (recent_message.length > preview_length) {
                    recent_message = recent_message.substring(0, (preview_length - 3)) + "...";
                }
                const buttonColor = (activeConversation === astro || hoveredButton === index) ? "#2b2b2b" : "#0F0F0F";
                return (
                    <div style={{ paddingBottom: "10px" }}>
                        <CompoundButton
                            style={{
                                fontSize: "13px", width: "100%", height: "45px", border: "0px",
                                backgroundColor: buttonColor,
                                transition: "background-color 0.2s ease"
                            }}
                            shape='circular'
                            secondaryContent={<span style={{ display: "inline-block", width: "150px" }}>{recent_message}</span>}
                            icon={<ContactImage astro={astro} />}
                            onClick={() => {
                                if (activeConversation === astro) {
                                    setActiveConversation(-1);
                                }
                                setActiveConversation(astro);
                            }}
                            onMouseEnter={() => {
                                handleMouseEnter(index);
                            }}
                            onMouseLeave={() => {
                                handleMouseLeave();
                            }}
                        >
                            Astronaut {astro}
                        </CompoundButton>
                    </div>
                );
            })}
        </div>
    );
}

export default MessageDrawer;
