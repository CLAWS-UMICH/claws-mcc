import React, {CSSProperties} from 'react';
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from '@react-google-maps/api';
import {BaseWaypoint, ManagerAction as MapAction} from "./WaypointManager.tsx";
import {Body1, Body1Stronger, Button,} from "@fluentui/react-components";
import {ComposeFilled} from "@fluentui/react-icons";
import {isNil, isUndefined} from "lodash";

const key = "AIzaSyBKoEACDcmaJYjODh0KpkisTk1MPva76s8";

type MapObject = {
    location: string,
    name: string,
    zoomlevels: number,
    copyright: string,
    caption: string
}

/**
 * Adds custom map types for each type of Mars imagery.
 * @param {google.maps.Map} map The map to which to add these map types.
 */
function addMarsMapTypes(map: google.maps.Map) {
    const mapsServer = 'mw1.google.com/mw-planetary/mars/';
    const maps: { [index: string]: MapObject } = {
        elevation: {
            location: mapsServer + 'elevation',
            name: 'elevation',
            zoomlevels: 9,
            copyright: 'NASA / JPL / GSFC / Arizona State University',
            caption: 'A shaded relief map color-coded by altitude'
        },
        visible: {
            location: mapsServer + 'visible',
            name: 'visible',
            zoomlevels: 10,
            copyright: 'NASA / JPL / MSSS / Arizona State University',
            caption: 'A mosaic of images from the visible portion of the spectrum'
        },
        infrared: {
            location: mapsServer + 'infrared',
            name: 'infrared',
            zoomlevels: 13,
            copyright: 'NASA / JPL / Arizona State University',
            caption: 'A mosaic of images from the infrared portion of the spectrum'
        }
    };

    map.mapTypes.set('elevation', makeMarsMapType(maps['elevation']));
    map.mapTypes.set('visible', makeMarsMapType(maps['visible']));
    map.mapTypes.set('infrared', makeMarsMapType(maps['infrared']));

    map.setMapTypeId('elevation');
}

/**
 * Builds a custom map type for Mars based on the provided parameters.
 * @param {Object} m JSON representing the map type options.
 * @return {google.maps.ImageMapType} .
 */
function makeMarsMapType(m: MapObject): google.maps.ImageMapType {
    const opts = {
        baseUrl: 'https://' + m.location + '/',
        getTileUrl: function (tile: google.maps.Point, zoom: number) {
            let bound = Math.pow(2, zoom);
            let x = tile.x;
            let y = tile.y;
            // Don't repeat across y-axis (vertically).
            if (y < 0 || y >= bound) {
                return null;
            }

            // Repeat across x-axis.
            if (x < 0 || x >= bound) {
                x = (x % bound + bound) % bound;
            }
            let qstr = 't';
            for (let z = 0; z < zoom; z++) {
                bound = bound / 2;
                if (y < bound) {
                    if (x < bound) {
                        qstr += 'q';
                    } else {
                        qstr += 'r';
                        x -= bound;
                    }
                } else {
                    if (x < bound) {
                        qstr += 't';
                        y -= bound;
                    } else {
                        qstr += 's';
                        x -= bound;
                        y -= bound;
                    }
                }
            }
            return 'https://' + m.location + '/' + qstr + '.jpg';
        },
        tileSize: new google.maps.Size(256, 256),
        maxZoom: m.zoomlevels - 1,
        minZoom: 0,
        name: m.name.charAt(0).toUpperCase() + m.name.substr(1)
    };

    return new google.maps.ImageMapType(opts);
}


const center = {
    lat: 42.27697713747799,
    lng: -83.73820501490505
};

interface WaypointMapProps {
    temp?: BaseWaypoint
    style: CSSProperties
    waypoints: BaseWaypoint[];
    selected: BaseWaypoint | null;
    dispatch: React.Dispatch<MapAction>;
}

type InfoProps = {
    dispatch: React.Dispatch<MapAction>;
    temp?: BaseWaypoint;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selected: BaseWaypoint | null;
};

const InfoWindows: React.FC<InfoProps> = props => {
    if (isNil(props.selected) && isUndefined(props.temp)) {
        props.setOpen(false);
        return null
    }
    if (isNil(props.selected)) {
        const waypoint = props.temp as BaseWaypoint;
        const latLng = new google.maps.LatLng(waypoint.location.latitude, waypoint.location.longitude);
        // props.dispatch({type: 'deselect', payload: waypoint});
        props.setOpen(true);
        return (
            <InfoWindow position={latLng} onCloseClick={() => {
                props.dispatch({type: 'clearTemp'});

            }}>
                <div style={{width: "200px"}}>
                    <Body1>Lat: {waypoint.location.latitude.toFixed(4)}</Body1>
                    <Body1>Long: {waypoint.location.longitude.toFixed(4)}</Body1>
                    <Button icon={<ComposeFilled/>} onClick={() => {
                        props.dispatch({type: 'writeTemp', payload: waypoint});
                    }}>Edit</Button>
                </div>
            </InfoWindow>
        );
    }
    const waypoint = props.selected
    const latLng = new google.maps.LatLng(waypoint.location.latitude, waypoint.location.longitude);
    props.setOpen(true);
    return (
        <InfoWindow position={latLng}>
            <div style={{width: "200px"}}>
                <Body1Stronger>{waypoint.description}</Body1Stronger>
                <Body1>Lat: {waypoint.location.latitude.toFixed(4)}</Body1>
                <Body1>Long: {waypoint.location.longitude.toFixed(4)}</Body1>
                <Body1>Author: {waypoint.author}</Body1>
                <Body1>Waypoint ID: {waypoint.waypoint_id}</Body1>
            </div>
        </InfoWindow>
    );
}

type WaypointMapState = {
    type: "marker" | "temp" | "none";
    waypoint: BaseWaypoint | null
}

export const WaypointMap: React.FC<WaypointMapProps> = props => {
    console.log("WaypointMap was rendered!")
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: key
    })
    // Selects the correct map type based on the selected waypoint and the temp waypoint.
    return isLoaded ? (
        <div style={{gridColumn: "1"}}>
            <GoogleMap
                mapContainerStyle={props.style}
                center={center}
                zoom={10}
                onLoad={addMarsMapTypes}
                options={{
                    streetViewControl: false,
                    mapTypeControlOptions: {mapTypeIds: ['elevation', 'visible', 'infrared']}
                }}>
                {props.waypoints.map(marker => {
                    const position = {lat: marker.location.latitude, lng: marker.location.longitude};
                    return (
                        <div key={marker.waypoint_id}>
                            <Marker position={position}
                                    onClick={() => {
                                        props.dispatch({type: 'select', payload: marker});
                                    }}/>
                        </div>);
                })}
                {(!isNil(props.selected) && isUndefined(props.temp)) ?
                    <InfoWindow
                        onLoad={i => console.log(i)}
                        position={{lat: props.selected.location.latitude, lng: props.selected.location.longitude}}>
                        <div>
                            Test
                        </div>
                    </InfoWindow> : null
                }
            </GoogleMap>
        </div>
    ) : <></>
}
