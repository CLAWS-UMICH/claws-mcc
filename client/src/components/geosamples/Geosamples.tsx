import React from 'react'
import { WaypointMap, WaypointMapProps } from '../waypoints/WaypointMap.tsx';
import {BaseWaypoint, ManagerAction, ManagerAction as MapAction, WaypointType} from "../waypoints/WaypointManager.tsx";
import { WaypointList } from '../waypoints/WaypointList.tsx';
import { Divider, InlineDrawer } from '@fluentui/react-components';
import { WaypointsDrawer } from '../waypoints/WaypointsDrawer.tsx';
import { waypointsReducer, ManagerState, WaypointManager, initialState } from '../waypoints/WaypointManager.tsx';
import { useReducer, useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { ReadyState } from 'react-use-websocket';

const GeosampleManager: React.FC = () => {

    const [state, dispatch] = useReducer(waypointsReducer, initialState)
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const {sendMessage, lastMessage, readyState} = useWebSocket("ws://localhost:8000/frontend", {
        onOpen: () => sendMessage(JSON.stringify({type: 'GET_WAYPOINTS'}))
    });
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage.data));
            dispatch({type: 'set', payload: JSON.parse(lastMessage.data).data});
        }
    }, [lastMessage, setMessageHistory]);
    return (
        <div style={{display: "flex"}}>
            <InlineDrawer separator open>
                <WaypointsDrawer selected={state.selected} waypoints={state.waypoints} dispatch={dispatch}
                                 ready={readyState === ReadyState.OPEN}/>
            </InlineDrawer>
            <div className='waypoints-container'>
                <WaypointList temp={state.temp} waypoints={state.waypoints} selected={state.selected}
                              dispatch={dispatch}/>
                <Divider/>
                <WaypointMap waypoints={state.waypoints}
                             selected={state.selected}
                             dispatch={dispatch}/>
            </div>
        </div>
    );

    // OLD STUFF UNCOMMENT IF NEED
     // Define waypoints and other props as needed
     // const [waypoints, setWaypoints] = React.useState<BaseWaypoint[]>([]); // Example waypoints

     // const dispatchWaypointAction = (action: ManagerAction) => {
        // switch (action.type) {
            // case 'add':
                // setWaypoints(prevWaypoints => [...prevWaypoints, action.payload]);
                // break;
            // Other cases for updating or deleting waypoints
            // default:
                // break;
        // }
     // }; // Example dispatch function
 
     // Construct props for WaypointMap component
     // const mapProps: WaypointMapProps = {
         // waypoints: waypoints,
         // dispatch: dispatchWaypointAction
     // };
    // return (
        // div containing map based off of nav one (figure out how to import buried functions)
        // <div>
            // <h1>Geosample Map!!! #fire </h1>
            // <div id="mapContainer">
                // <WaypointsDrawer selected={state.selected} waypoints={state.waypoints} dispatch={dispatch}
                                 // ready={readyState === ReadyState.OPEN}/>
                // <Divider></Divider>
                // <WaypointMap {...mapProps} />
            // </div>
        // </div>
        // x
    // )
}

export default GeosampleManager;