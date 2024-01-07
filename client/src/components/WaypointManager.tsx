import React, {CSSProperties, useEffect, useReducer, useState} from "react";
import {WaypointMap} from "./WaypointMap.tsx";
import {WaypointList} from "./WaypointList.tsx";
import {isNil} from "lodash";

export enum WaypointType {
    STATION,
    NAV,
    GEO,
    DANGER
}

export type ManagerState = {
    temp?: BaseWaypoint; // Used to store a waypoint that is being created
    waypoints: BaseWaypoint[];
    selected: BaseWaypoint | null;
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

interface ServerListenerProps {
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    dispatch: React.Dispatch<ManagerAction>;
}

// Does not render anything, but listens for server events and dispatches actions
const ServerListener: React.FC<ServerListenerProps> = props => {
    const {dispatch, setLoading} = props;
    useEffect(() => {
        const ws = new WebSocket('ws://localhost:8000/frontend');
        ws.onopen = () => {
            // Send a message to the server to get all waypoints
            ws.send(JSON.stringify({type: 'GET_WAYPOINTS'}));
        }
        ws.onmessage = e => {
            const message = JSON.parse(e.data);
            dispatch({type: 'set', payload: message.data});
            setLoading(false);
        }
        return () => {
            if (ws.readyState === WebSocket.OPEN) ws.close();
        };
    }, [dispatch, setLoading]);

    return null
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
                selected: state.selected === action.payload ? null : state.selected
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

const initialState: ManagerState = {waypoints: [], selected: null, message: ""}

const containerStyle: CSSProperties = {
    width: '400px',
    height: '400px',
    justifySelf: "center",
};

const WaypointManager: React.FC = () => {
    const [state, dispatch] = useReducer(waypointsReducer, initialState)
    const [loading, setLoading] = useState(true)
    return (
        <div>
            <h1 style={{textAlign: "center"}}>{loading ? "Loading waypoints" : "Waypoints"}</h1>
            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", justifyItems: "center", margin: "0 2em"}}>
                <WaypointMap style={containerStyle} waypoints={state.waypoints} selected={state.selected}
                             dispatch={dispatch}/>
                <WaypointList temp={state.temp} waypoints={state.waypoints} selected={state.selected}
                              dispatch={dispatch}/>
                <ServerListener setLoading={setLoading} dispatch={dispatch}/>
            </div>
        </div>
    );
}

export default WaypointManager;
