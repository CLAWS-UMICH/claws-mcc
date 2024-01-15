import React, {CSSProperties, useEffect, useReducer, useState} from "react";
import {WaypointMap} from "./WaypointMap.tsx";
import {WaypointList} from "./WaypointList.tsx";
import useWebSocket, {ReadyState} from 'react-use-websocket';
import './Waypoints.css';

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
    message: string | null;
}

export type ManagerAction =
    { type: 'set', payload: BaseWaypoint[] } | // Should only be used by ServerListener
    { type: 'add', payload: BaseWaypoint } |
    { type: 'remove', payload: BaseWaypoint[] } |
    { type: 'update', payload: { old: BaseWaypoint, new: BaseWaypoint } } |
    { type: 'select', payload: BaseWaypoint } |
    { type: 'deselect', payload: BaseWaypoint } |
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
                headers: {"Content-Type": "application/json", "Accept": "application/json"}
            }
        ).then(res => res.json()).then(setAstronaut);
    }, [idOrName]);
    return astronaut;
}

const waypointsReducer = (state: ManagerState, action: ManagerAction): ManagerState => {
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

const initialState: ManagerState = {waypoints: [], message: ""}

const containerStyle: CSSProperties = {
    width: '400px',
    height: '400px',
    justifySelf: "center",
};

const WaypointManager: React.FC = () => {
    const [state, dispatch] = useReducer(waypointsReducer, initialState)
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const { sendMessage, lastMessage, readyState } = useWebSocket("ws://localhost:8000/frontend", {
        onOpen: () => sendMessage(JSON.stringify({type: 'GET_WAYPOINTS'}))
    });
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage.data));
            dispatch({type: 'set', payload: JSON.parse(lastMessage.data).data});
        }
    }, [lastMessage, setMessageHistory]);
    return (
        <div>
            <h1 style={{textAlign: "center"}}>{readyState !== ReadyState.OPEN ? "Loading waypoints" : "Waypoints"}</h1>
            <div className='waypoints-container'>
                <WaypointMap style={containerStyle} waypoints={state.waypoints}
                             selected={state.selected}
                             dispatch={dispatch}/>
                <WaypointList temp={state.temp} waypoints={state.waypoints} selected={state.selected}
                              dispatch={dispatch}/>
            </div>
        </div>
    );
}

export default WaypointManager;
