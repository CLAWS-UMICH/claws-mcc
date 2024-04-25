import React, {useCallback} from 'react';
import {useAstronaut} from "../waypoints/WaypointManager.tsx";
import {Body1, Body1Stronger, Skeleton, CompoundButton} from "@fluentui/react-components";
import {isEqual} from "lodash";
import { makeStyles } from '@fluentui/react-components';
import {BaseMessage} from "./Messages.tsx";

const useStyles = makeStyles({
    imageText: {
        fontSize: "13px",
        position: "absolute",
        marginTop: "-25.5px",
        marginLeft: "8px"
    }
});

function DrawerItem({astronaut, messages}) {
}

function SampleImage({astro}) {
    const styles = useStyles();
    return (
        <div style={{marginLeft: "-10px"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="13.5" fill="#006704" stroke="#4CAB50"/>
            </svg>
            <div className={styles.imageText}><b>A{astro}</b></div>
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
        <div style={{display: 'flex', flexDirection: 'column', alignItems: "center", paddingTop: "15px"}}>
            {Array.from(conversations.keys()).map((key, index) => {
                    const astro = key as number;
                    
                    let recent_message = conversations.get(astro)[conversations.get(astro).length - 1].data.message;
                    let preview_length = 25;
                    if(recent_message.length > preview_length) {
                        recent_message = recent_message.substring(0, (preview_length - 3)) + "...";
                    } 
                    return (   
                        <div style={{paddingBottom: "10px"}}>
                            <CompoundButton
                                style={{fontSize: "13px", width: "100%", height: "45px", border: "0px",
                                backgroundColor: hoveredButton === index ? "#2b2b2b" : "#0F0F0F",
                                transition: "background-color 0.2s ease"
                                }}
                                shape='circular'
                                secondaryContent={<span style={{ display: "inline-block", width: "150px"}}>{recent_message}</span>}
                                icon={<SampleImage astro={astro}/> }
                                onClick={()=>{
                                    setActiveConversation(astro);
                                }}
                                onMouseEnter={()=>{
                                    handleMouseEnter(index);
                                }}
                                onMouseLeave={()=>{
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
