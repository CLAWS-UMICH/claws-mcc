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
import { Search20Regular, Edit16Regular, Delete16Regular, Map16Regular, Star16Regular, Star16Filled } from "@fluentui/react-icons";
import SearchBox from '../common/SearchBox/SearchBox.tsx'
import DetailScreen from './DetailScreen.tsx';
import GeosampleList from './GeosampleList.tsx';
import "./Geosamples.css"
// import { GeosampleMap } from './GeosampleMap.tsx';
import { WaypointMap } from '../waypoints/WaypointMap.tsx';

type ARLocation = {
    latitude: number;
    longitude: number;
}

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
}

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
}

export type BaseZone = {
    zone_id: string;
    geosample_ids: BaseGeosample[];
    location: ARLocation;
    radius: number;
}

export type ManagerState = {
    sample_zones: BaseZone[];
    geosamples: BaseGeosample[];
    selected?: BaseGeosample;
}

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
}
var geosample: BaseGeosample = {
    geosample_id: 1, 
    zone_id: "A", 
    starred: true, 
    eva_data: {
        name: "Geo Sample 1",
        id: 2394,
        data: {
            SiO2: 10.00,
            TiO2: 10.00,
            Al2O3: 10.00,
            FeO: 10.00,
            MnO: 10.00,
            MgO: 10.00,
            CaO: 10.00,
            K2O: 10.00,
            P2O3: 10.00,
        }
    },
    time: "14:23:27",
    date: "3/20/2025",
    color: "Brown",
    shape: "Square",
    rock_type: "Basalt",
    location: {
        latitude: 108.1442,
        longitude: 199.2442
    },
    author: 2,
    description: "this is a description",
    image: "../../assets/temp_sample_pic.png"
}

var geosample2: BaseGeosample = {
    geosample_id: 2, 
    zone_id: "A", 
    starred: false, 
    eva_data: {
        name: "Geo Sample 2",
        id: 4924,
        data: { 
            SiO2: 11.72,
            TiO2: 8.70,
            Al2O3: 1.75,
            FeO: 7.21,
            MnO: 17.28,
            MgO: 10.70,
            CaO: 16.92,
            K2O: 4.12,
            P2O3: 20.87,
        }
    },
    time: "19:29:33",
    date: "3/13/2025",
    color: "Black",
    shape: "Hexagon",
    rock_type: "Limestone",
    location: {
        latitude: 104.1442,
        longitude: 219.3333
    },
    author: 1,
    description: "ohhhhoo",
    image: "../../assets/temp_sample_pic.png"
}

var zones: BaseZone[] = [{zone_id: "A",
                            geosample_ids: [geosample, geosample2],
                            location: {
                                latitude: 100.2321,
                                longitude: 205.2345
                            },
                            radius: 15.3249},
                            {zone_id: "B",
                            geosample_ids: [{
                                geosample_id: 3, 
                                zone_id: "B", 
                                starred: false, 
                                eva_data: {
                                    name: "Geo Sample 1",
                                    id: 3937,
                                    data: { 
                                        SiO2: 10.20,
                                        TiO2: 7.80,
                                        Al2O3: 3.30,
                                        FeO: 9.30,
                                        MnO: 13.27,
                                        MgO: 6.13,
                                        CaO: 18.65,
                                        K2O: 29.35,
                                        P2O3: 2.00,
                                    }
                                },
                                time: "13:43:27",
                                date: "3/10/2025",
                                color: "Red",
                                shape: "Circle",
                                rock_type: "Granite",
                                location: {
                                    latitude: 95.1442,
                                    longitude: 100.3333
                                },
                                author: 1,
                                description: "ohhhhoo",
                                image: "../../assets/temp_sample_pic.png"
                            }],
                                                        location: {
                                latitude: 100.2321,
                                longitude: 205.2345
                            },
                            radius: 15.3249},
                        ]

const initialState: ManagerState = {geosamples: [geosample, geosample2], sample_zones: zones, selected: undefined}

const GeosampleManager: React.FC = () => { 
    const styles = useStyles();   
    const [state, dispatch] = useReducer(geosampleReducer, initialState);
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const [showSearchBar, setShowSearchBar] = useState(false);

    const {sendMessage, lastMessage, readyState} = useWebSocket("ws://localhost:8000/frontend", {
        onOpen: () => {
            sendMessage(JSON.stringify({type: 'GET_SAMPLES'}));
        }
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
                    <Divider className={styles.dividerTop}></Divider>
                    {showSearchBar && (<div>               
                                            <DrawerBody>
                                                <SearchBox handleDismiss={() => setShowSearchBar(!showSearchBar)}/>
                                            </DrawerBody>
                                            <Divider className={styles.divider}></Divider>
                                        </div>)}
                </div>
                <DrawerBody>
                    <GeosampleList sample_zones={state.sample_zones} selected={state.selected} dispatch={dispatch} ready={readyState === ReadyState.OPEN}/>
                </DrawerBody>
            </InlineDrawer>
            <DrawerBody>
                <DetailScreen geosample={state.selected} dispatch={dispatch}/>
                <div className={styles.mapContainer}>
                    {/* <div style={{alignItems:"center", height: "400px", width:"750px"}}>
                        <WaypointMap waypoints={state.waypoints} selected={state.selected} dispatch={dispatch}/>
                    </div> */}
                </div>
            </DrawerBody>
        </div>
    );
};

export default GeosampleManager;