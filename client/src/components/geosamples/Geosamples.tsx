// Geosamples.tsx
import React, { useEffect, useReducer, useState } from 'react';
import SidebarMenu from './SidebarMenu.tsx';
import GeosampleList from './GeosampleList.tsx';
import {
    Button,
    Divider,
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  InlineDrawer,
  makeStyles,
  shorthands,
} from "@fluentui/react-components";
import { Search20Regular } from "@fluentui/react-icons";
import SearchBox from '../common/SearchBox/SearchBox.tsx'
import "./Geosamples.css"
import { GeosampleMap } from './GeosampleMap.tsx';
import { WaypointDrawer } from '../waypoints/WaypointDrawer.tsx';
import { WaypointList } from '../waypoints/WaypointList.tsx';
import { WaypointMap } from '../waypoints/WaypointMap.tsx';
import useWebSocket, { ReadyState } from 'react-use-websocket';

type EvaData = {
    name: string;
    id: number;
    data: {
        SiO2: number;
        TiO2: number;
        Al2O3: number;
        FeO: number;
        MnO: number;
        MgO: number;
        CaO: number;
        K2O: number;
        P2O3: number;
    }
}

export enum WaypointType {
    STATION,
    NAV,
    GEO,
    DANGER
}

export type BaseWaypoint = {
    _id?: number; // server generated
    waypoint_id: number; //sequential
    details: string // not in mongo
    date: string// not in mongo
    time: string// not in mongo
    location: { latitude: number, longitude: number };
    type: WaypointType;
    description: string;
    author: number; //-1 if mission control created
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

const useStyles = makeStyles({
  root: {
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

  dividerContainer: {
    width: "100%"
  },

  divider: {
    marginTop: "15px",
    marginBottom: "15px"
  },

  dividerTop: {
    marginTop: "15px",
    // marginBottom: "-10px"
  },

  header: {
    marginTop: "-10px",
    marginBottom: "-7.5px"
  }
});

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

const initialState: ManagerState = {waypoints: []}

const GeosampleManager: React.FC = () => {    
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [state, dispatch] = useReducer(waypointsReducer, initialState)
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const {sendMessage, lastMessage, readyState} = useWebSocket("ws://localhost:8000/frontend", {
        onOpen: () => sendMessage(JSON.stringify({type: 'GET_WAYPOINTS'}))
    });

    const dropdownMenus = [
        <GeosampleList header="Header 1" samples={['Link 1.1', 'Link 1.2', 'Link 1.3']} />,
        <GeosampleList header="Header 2" samples={['Link 2.1', 'Link 2.2']} />,
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

    const handleDismiss = () => {
        setShowSearchBar(false);
    };

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage.data));
            dispatch({type: 'set', payload: JSON.parse(lastMessage.data).data});
        }
    }, [lastMessage, setMessageHistory]);

    return (
        <div className={styles.root}>
        <InlineDrawer separator open>
            <DrawerHeader className={styles.header}>
            <DrawerHeaderTitle action={<Button size="medium" icon={<Search20Regular/>} onClick={() => setShowSearchBar(!showSearchBar)}></Button>}><b>Samples</b></DrawerHeaderTitle>
            </DrawerHeader>
            <div className={styles.dividerContainer}>
                <Divider className={styles.dividerTop}></Divider>
                {showSearchBar && (
                <div>               
                <DrawerBody>
                <SearchBox handleDismiss={handleDismiss}/>
                {/* <SamplesList/> */}
                </DrawerBody>
                <Divider className={styles.divider}></Divider></div>)}
            </div>
            <DrawerBody><SidebarMenu dropdownMenus={dropdownMenus}/></DrawerBody>
        </InlineDrawer>
        <div className={styles.content}>
        {/* <div style={{display: "flex"}}> */}
            {/* <InlineDrawer separator open>
                <WaypointDrawer selected={state.selected} waypoints={state.waypoints} dispatch={dispatch}
                                 ready={readyState === ReadyState.OPEN}/>
            </InlineDrawer> */}
            <div className='waypoints-container'>
                {/* <WaypointList temp={state.temp} waypoints={state.waypoints} selected={state.selected}
                              dispatch={dispatch}/> */}
                <Divider/>
                <WaypointMap waypoints={state.waypoints}
                             selected={state.selected}
                             dispatch={dispatch}/>
            </div>
        </div>
        {/* </div> */}
        </div>
    );
};

export default GeosampleManager;