import React, { useEffect, useReducer, useState } from "react";
import { DrawerBody, Divider, InlineDrawer, DrawerHeader, Button, DrawerHeaderTitle } from "@fluentui/react-components";
import { WaypointMap } from "./WaypointMap.tsx";
import { ReadyState } from 'react-use-websocket';
import './Waypoints.css';
import { WaypointDrawer } from "./WaypointDrawer.tsx";
import { WaypointView } from "./WaypointView.tsx";
import useDynamicWebSocket from "../../hooks/useWebSocket.tsx";
import { AddCircle24Filled } from "@fluentui/react-icons";


export enum WaypointType {
    STATION,
    NAV,
    GEO,
    DANGER
}

export type ManagerState = {
    temp?: BaseWaypoint; // Used to store a waypoint that is being created
    waypoints: BaseWaypoint[];
    selected?: BaseWaypoint;
    message?: string;
}

export type ManagerAction =
    { type: 'set', payload: BaseWaypoint[] } | // Should only be used by ServerListener
    { type: 'add', payload: BaseWaypoint } |
    { type: 'remove', payload: BaseWaypoint[] } |
    { type: 'update', payload: { old: BaseWaypoint, new: BaseWaypoint } } |
    { type: 'select', payload: BaseWaypoint } |
    { type: 'deselect' } |
    { type: 'writeTemp', payload: BaseWaypoint } |
    { type: 'clearTemp' };

export type BaseWaypoint = {
    _id?: number; // server generated
    waypoint_id: number; //sequential
    location: { latitude: number, longitude: number };
    type: WaypointType;
    description: string;
    author: number; //-1 if mission control created
}

export interface Astronaut {
    id: number,
    name: string
}

export const useAstronaut = (idOrName: string | number) => {
    const [astronaut, setAstronaut] = useState<Astronaut | null>(null);
    useEffect(() => {
        fetch(`/api/astronaut/${idOrName}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", "Accept": "application/json" }
        }
        ).then(res => res.json()).then(setAstronaut);
    }, [idOrName]);
    return astronaut;
}

export const waypointsReducer = (state: ManagerState, action: ManagerAction): ManagerState => {
    switch (action.type) {
        case 'add':
            return {
                ...state,
                waypoints: [...state.waypoints, action.payload]
            };
        case 'remove':
            return {
                ...state,
                waypoints: state.waypoints.filter((waypoint) => !action.payload.includes(waypoint))
            };
        case 'update':
            return {
                ...state,
                waypoints: state.waypoints.map((waypoint) => {
                    if (waypoint._id === action.payload.old._id) {
                        return action.payload.new;
                    } else {
                        return waypoint;
                    }
                })
            };
        case 'select':
            return {
                ...state,
                selected: action.payload
            };
        case 'deselect':
            return {
                ...state,
                selected: undefined
            };
        case 'set':
            return {
                ...state,
                waypoints: action.payload
            };
        case 'writeTemp':
            return {
                ...state,
                temp: action.payload
            };
        case 'clearTemp':
            return {
                ...state,
                temp: undefined
            };
        default:
            return state;
    }
}

const initialState: ManagerState = { waypoints: [] }

export const WaypointManager: React.FC = () => {
    const [EVALocations, setEVALocations] = useState<Array<object>>([
        { name: "EVA1", posx: 0, posy: 0 },
        { name: "EVA2", posx: 0, posy: 0 }
    ]);
    const [state, dispatch] = useReducer(waypointsReducer, initialState)
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const { sendMessage, lastMessage, readyState } = useDynamicWebSocket({
        onOpen: () => sendMessage(JSON.stringify({ type: 'GET_WAYPOINTS' })),
        type: 'WAYPOINTS'
    });
    useEffect(() => {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            if (data?.data?.data?.isLocation) {
                setEVALocations([
                    {
                        name: "EVA1",
                        posx: data?.data?.imu.eva1.posx,
                        posy: data?.data?.imu.eva1.posy,
                    },
                    {
                        name: "EVA2",
                        posx: data?.data?.imu.eva2.posx,
                        posy: data?.data?.imu.eva2.posy
                    }
                ])
            } else {
                setMessageHistory((prev) => prev.concat(lastMessage.data));
                dispatch({ type: 'set', payload: JSON.parse(lastMessage.data).data });
            }
        }
    }, [lastMessage, setMessageHistory]);
    return (
        <div style={{ display: "flex", height: "100vh", backgroundColor: "#000000", width: "100%" }}>
            <InlineDrawer style={{ backgroundColor: "#0F0F0F", width: "250px" }} className={'drawer'} separator open>

                <DrawerHeader style={{ backgroundColor: "#141414", borderBottom: "1px solid #333333" }}>
                    <DrawerHeaderTitle

                        action=
                        {
                            <Button size={"medium"} icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                    viewBox="0 0 20 20" fill="none">
                                    <path
                                        d="M6.5 8.5C6.5 8.22386 6.72386 8 7 8H9.5V5.5C9.5 5.22386 9.72386 5 10 5C10.2761 5 10.5 5.22386 10.5 5.5V8H13C13.2761 8 13.5 8.22386 13.5 8.5C13.5 8.77614 13.2761 9 13 9H10.5V11.5C10.5 11.7761 10.2761 12 10 12C9.72386 12 9.5 11.7761 9.5 11.5V9H7C6.72386 9 6.5 8.77614 6.5 8.5ZM14.9497 13.955C17.6834 11.2201 17.6834 6.78601 14.9497 4.05115C12.2161 1.31628 7.78392 1.31628 5.05025 4.05115C2.31658 6.78601 2.31658 11.2201 5.05025 13.955L6.57128 15.4538L8.61408 17.4389L8.74691 17.5567C9.52168 18.1847 10.6562 18.1455 11.3861 17.4391L13.8223 15.0691L14.9497 13.955ZM5.75499 4.75619C8.09944 2.41072 11.9006 2.41072 14.245 4.75619C16.5294 7.04153 16.5879 10.7104 14.4207 13.0667L14.245 13.2499L12.9237 14.5539L10.6931 16.7225L10.6002 16.8021C10.2459 17.0699 9.7543 17.0698 9.40012 16.802L9.30713 16.7224L6.3263 13.817L5.75499 13.2499L5.57927 13.0667C3.41208 10.7104 3.47065 7.04153 5.75499 4.75619Z"
                                        fill="white" />
                                </svg>}
                                onClick={() => {
                                    dispatch({ type: "deselect" });
                                    dispatch({
                                        type: "writeTemp",
                                        payload: {
                                            waypoint_id: -1,
                                            author: -1,
                                            type: WaypointType.NAV,
                                            description: "",
                                            location: { latitude: 0, longitude: 0 }
                                        }
                                    });

                                }}>New Waypoint</Button>}>
                        Navigation
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <WaypointDrawer selected={state.selected} waypoints={state.waypoints} dispatch={dispatch}
                    ready={readyState === ReadyState.OPEN} />
            </InlineDrawer>
            <div className={"waypoints-container"}>
                <WaypointView {...state} dispatch={dispatch} />
                <Divider className="waypoints-container-divider" />
                <WaypointMap waypoints={state.waypoints}
                    selected={state.selected}
                    dispatch={dispatch}
                    EVALocations={EVALocations}
                />
            </div>
        </div>
    );
}

export default WaypointManager;
