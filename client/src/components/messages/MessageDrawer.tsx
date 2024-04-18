import React, {useCallback} from 'react';
import {useAstronaut} from "../waypoints/WaypointManager.tsx";
import {Body1, Body1Stronger, Skeleton} from "@fluentui/react-components";
import {isEqual} from "lodash";
import {BaseMessage} from "./Messages.tsx";

function DrawerItem({astronaut, messages}) {
}

function MessageDrawer({ messages, conversations, setActiveConversation, activeConversation }) {
    return (
        <div>
            {Array.from(conversations.keys()).map((key, index) => {
                const astro = key as number;
                return (
                    <div key={index}>
                        <div onClick={()=>{
                            setActiveConversation(astro);
                        }}>Astronaut {astro}</div>
                    </div>
                );
            })}
        </div>
    );
}

export default MessageDrawer;
