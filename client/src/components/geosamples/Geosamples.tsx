// Geosamples.tsx
import React from 'react';
import SidebarMenu from './SidebarMenu.tsx';
import DropdownMenu from './DropdownMenu.tsx';
import {
    Divider,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  InlineDrawer,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import SearchBox from '../common/SearchBox/SearchBox.tsx'


const useStyles = makeStyles({
  root: {
    ...shorthands.border("2px", "solid", "#ccc"),
    ...shorthands.overflow("hidden"),
    display: "flex",
    height: "100vh",
    backgroundColor: "#fff",
  },

  content: {
    ...shorthands.flex(1),
    ...shorthands.padding("16px"),
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

const GeosampleManager: React.FC = () => {
    const dropdownMenus = [
        <DropdownMenu header="Header 1" samples={['Link 1.1', 'Link 1.2', 'Link 1.3']} />,
        <DropdownMenu header="Header 2" samples={['Link 2.1', 'Link 2.2']} />,
    ];
    const styles = useStyles();
    const menuData = [
    {
        header: 'Header 1',
        samples: ['Link 1.1', 'Link 1.2', 'Link 1.3'],
    },
    {
        header: 'Header 2',
        samples: ['Link 2.1', 'Link 2.2'],
    },
    ];
    const dropdownTest = {
        header: 'test drop',
        samples: ['1', '2', '3'],
    };

    return (
        <SidebarMenu dropdownMenus={dropdownMenus}/>
        // <div className={styles.root}>
        // <InlineDrawer separator open>
        //     <DrawerHeader>
        //     <DrawerHeaderTitle>Samples</DrawerHeaderTitle>
        //     </DrawerHeader>
        //     <DrawerBody>
        //         <SearchBox/>
        //         <SamplesList/>
        //     </DrawerBody>
        // </InlineDrawer>
        // <div className={styles.content}>
        //     <p>This is the page content</p>
        // </div>
        // </div>
    );

    // return (
    //     <DropdownMenu/>
    //     // <SidebarMenu dropdownMenus={dropdownMenus} />
    // );
};
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