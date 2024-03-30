// Geosamples.tsx
import React, { useEffect, useReducer, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
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
import DetailScreen from './DetailScreen.tsx';
import GeosampleList from './GeosampleList.tsx';

type ARLocation = {
    latitude: number;
    longitude: number;
};

export type EvaData = {
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
};

export type BaseGeosample = {
    _id?: number;
    geosample_id: number;
    zone_id: string;
    starred: boolean;
    eva_data: EvaData;
    time: string; 
    date: string;
    color: string;
    shape: string;
    rock_type: string; 
    location: ARLocation;
    author: number;
    description: string;
    image: string;
};

export type BaseZone = {
    zone_id: string;
    geosample_ids: BaseGeosample[];
    location: ARLocation;
    radius: number;
};

export type ManagerState = {
    sample_zones: BaseZone[];
    geosamples: BaseGeosample[];
    selected?: BaseGeosample;
};

export type ManagerAction =
    { type: 'set', payload: {zones: BaseZone[], samples: BaseGeosample[]} } | // Should only be used by ServerListener
    { type: 'delete', payload: BaseGeosample } |
    { type: 'update', payload: BaseGeosample } |
    { type: 'select', payload: BaseGeosample } |
    { type: 'deselect' };


const useStyles = makeStyles({
  root: {
    ...shorthands.overflow("hidden"),
    display: "flex",
    height: "100vh",
    backgroundColor: "#fff",
  },
  dividerContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    ...shorthands.gap("10px"),
  },
  divider: {
    // marginTop: "15px",
    // marginBottom: "15px"
  },
  dividerTop: {
    // marginTop: "10px",
  },
  header: {
    // marginBottom: "-7.5px",
    paddingTop: "11px",
    paddingBottom: "11px",
  },
});

export const geosampleReducer = (state: ManagerState, action: ManagerAction): ManagerState => {
    switch (action.type) {
        case 'set':
            return {
                ...state,
                geosamples: action.payload.samples,
                sample_zones: action.payload.zones,
            };
        case 'delete':
            return {
                ...state,
                sample_zones: state.sample_zones.map(zone => ({
                    ...zone,
                    geosample_ids: zone.geosample_ids.filter(id => id.geosample_id !== action.payload.geosample_id)
                })),
            };
        case 'update':
            if (action.payload === undefined) {
                return state;
            }

            return {
                ...state,
                geosamples: state.geosamples.map((sample) => {
                    if (sample.geosample_id === action.payload.geosample_id) {
                        return action.payload;
                    }
                    return sample;
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
        default:
            return state;
    }
};

const initialState: ManagerState = {geosamples: [], sample_zones: [], selected: undefined};

const GeosampleManager: React.FC = () => { 
    const styles = useStyles();   
    const [state, dispatch] = useReducer(geosampleReducer, initialState);
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const [showSearchBar, setShowSearchBar] = useState(false);

    const {sendMessage, lastMessage, readyState} = useWebSocket("ws://localhost:8000/frontend", {
        onOpen: () => sendMessage(JSON.stringify({type: 'GET_SAMPLES'}))
    });
    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory((prev) => prev.concat(lastMessage.data));
            dispatch({type: 'set', payload: JSON.parse(lastMessage.data).data});
        }
    }, [lastMessage, setMessageHistory]);

    return (
        <div className={styles.root}>
            <InlineDrawer style={{width:"220px"}}separator open>
                <DrawerHeader className={styles.header}>
                    <DrawerHeaderTitle action={<Button size="medium" icon={<Search20Regular/>} onClick={() => setShowSearchBar(!showSearchBar)}></Button>}>
                        <b style={{fontSize:"18px"}}>Samples</b>
                    </DrawerHeaderTitle>
                </DrawerHeader>
                <div className={styles.dividerContainer}>
                    <Divider></Divider>
                    {showSearchBar && (<div style={{flexGrow: "1"}}>               
                                            <SearchBox handleDismiss={() => setShowSearchBar(!showSearchBar)}/>
                                            <Divider className={styles.divider}></Divider>
                                        </div>)}
                </div>
                <DrawerBody>
                    <GeosampleList sample_zones={state.sample_zones} selected={state.selected} dispatch={dispatch} ready={readyState === ReadyState.OPEN}/>
                </DrawerBody>
            </InlineDrawer>
            <DrawerBody style={{paddingLeft: '0px', paddingRight: '0px'}}>
                <DetailScreen geosample={state.selected} dispatch={dispatch}/>
            </DrawerBody>
        </div>
    );
};

export default GeosampleManager;