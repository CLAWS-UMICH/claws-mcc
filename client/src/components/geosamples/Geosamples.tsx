// Geosamples.tsx
import React, { useEffect, useId, useReducer, useState } from 'react';
import useWebSocket from 'react-use-websocket';
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
import { Search20Regular, Edit16Regular, Delete16Regular, Map16Regular, Star16Regular, Star16Filled } from "@fluentui/react-icons";
import SearchBox from '../common/SearchBox/SearchBox.tsx'
import { DetailScreen } from './DetailScreen.tsx';
import GeosampleList from './GeosampleList.tsx';
import "./Geosamples.css"
// import { GeosampleMap } from './GeosampleMap.tsx';
import { WaypointMap } from '../waypoints/WaypointMap.tsx';

type ARLocation = {
    latitude: number;
    longitude: number;
}

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

export type BaseZone = {
    zone_id: string;
    geosample_ids: [number];
    location: Location;
    radius: number;
}

export type BaseGeosample = {
    geosample_id: number;
    zone_id: string;
    eva_data: EvaData;
    time: string; 
    color: string;
    shape: string;
    rock_type: string; 
    location: ARLocation;
    author: number;
    description: string;
    image: string;
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
    geosamples: BaseGeosample[];
    starred?: Record<string, number[]>;

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
  dividerContainer: {
    width: "100%"
  },
  divider: {
    marginTop: "15px",
    marginBottom: "15px"
  },
  dividerTop: {
    marginTop: "10px",
  },
  header: {
    marginTop: "-14px",
    marginBottom: "-7.5px"
  },
  mapContainer: {
    ...shorthands.flex(1),
    ...shorthands.padding("16px"),
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
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
    // to keep stuff
    const styles = useStyles();   
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [isStarred, setIsStarred] = useState(false); 

    const [state, dispatch] = useReducer(waypointsReducer, initialState)
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const outlineId = useId();
    const {sendMessage, lastMessage, readyState} = useWebSocket("ws://localhost:8000/frontend", {
        onOpen: () => sendMessage(JSON.stringify({type: 'GET_WAYPOINTS'}))
    });
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage.data));
            dispatch({type: 'set', payload: JSON.parse(lastMessage.data).data});
        }
    }, [lastMessage, setMessageHistory]);

    const handleDismiss = () => { setShowSearchBar(false); };
    const handleFavoriting = () => {
        setIsStarred(!isStarred);
    }

    return (
        <div className={styles.root}>
            <InlineDrawer style={{width:"33.33%"}}separator open>
                <DrawerHeader className={styles.header}>
                    <DrawerHeaderTitle>
                        <b>temp section for camera view</b>
                    </DrawerHeaderTitle>
                </DrawerHeader>
            </InlineDrawer>
            <InlineDrawer style={{width:"220px"}}separator open>
                <DrawerHeader className={styles.header}>
                    <DrawerHeaderTitle action={<Button size="medium" icon={<Search20Regular/>} onClick={() => setShowSearchBar(!showSearchBar)}></Button>}>
                        <b style={{fontSize:"18px"}}>Samples</b>
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <div className={styles.dividerContainer}>
                    <Divider className={styles.dividerTop}></Divider>
                    {showSearchBar && (<div>               
                                            <DrawerBody>
                                                <SearchBox handleDismiss={handleDismiss}/>
                                            </DrawerBody>
                                            <Divider className={styles.divider}></Divider>
                                        </div>)}
                </div>
                <DrawerBody>
                    <GeosampleList header="Header 1" samples={['Link 1.1', 'Link 1.2', 'Link 1.3']} isStarred={isStarred} />
                </DrawerBody>
            </InlineDrawer>
            <DrawerBody>
                <div>
                    <h4 style={{marginTop:'.7rem', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        <div style={{ display: 'flex', alignItems: 'center', gap:'10px' }}>
                            <b style={{fontSize:"17px"}}>Geo Sample 1</b>
                            <Button icon={isStarred ? <Star16Filled style={{color:"#EAA300"}}/> : <Star16Regular />} onClick={handleFavoriting}></Button>
                        </div>
                        <div style={{display:'flex', gap:'10px'}}>
                            <Button icon={<Map16Regular/>}>View on map</Button>
                            <Button icon={<Edit16Regular/>}>Edit</Button>
                            <Button icon={<Delete16Regular/>}>Delete</Button>
                        </div>
                    </h4>
                    <Divider style={{marginLeft:'-24px', marginTop:'-9.1px', marginBottom:'.75rem', width:'1120px'}}></Divider>
                </div>
                <DetailScreen/>
                <div className={styles.mapContainer}>
                    <div style={{alignItems:"center", height: "400px", width:"750px"}}>
                        <WaypointMap waypoints={state.waypoints} selected={state.selected} dispatch={dispatch}/>
                    </div>
                </div>
            </DrawerBody>
        </div>
    );
};

export default GeosampleManager;