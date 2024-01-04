import React, {CSSProperties, useState} from 'react';
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from '@react-google-maps/api';
import {BaseWaypoint, ManagerAction as MapAction, WaypointType} from "./WaypointManager.tsx";
import {Body1, Body1Stronger, Button,} from "@fluentui/react-components";
import {ComposeFilled} from "@fluentui/react-icons";

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
    style: CSSProperties
    waypoints: BaseWaypoint[];
    selected: BaseWaypoint | null;
    dispatch: React.Dispatch<MapAction>;
}

interface InfoProps {
    position: google.maps.LatLngLiteral;
    dispatch: React.Dispatch<MapAction>;
    children: React.ReactNode;
    onCloseClick: () => void;
}

const Info: React.FC<InfoProps> = props => {
    return (
        <InfoWindow position={props.position}
                    options={{pixelOffset: new window.google.maps.Size(0, -40),}}
                    onCloseClick={props.onCloseClick}>
            {props.children}
        </InfoWindow>);
}

export const WaypointMap: React.FC<WaypointMapProps> = props => {
    const [infoWindow, setInfoWindow] = useState<React.JSX.Element>(
        props.selected === null ? null :
            <Info position={{lat: props.selected.location.x, lng: props.selected.location.y}} dispatch={props.dispatch}
                  onCloseClick={() => {
                      props.dispatch({type: "deselect", payload: props.selected})
                  }}>
                <div>
                    <h3>{props.selected.description}</h3>
                    <p>Waypoint ID: {props.selected.waypoint_id}</p>
                    <p>Author: {props.selected.author}</p>
                </div>
            </Info>);
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: key
    })
    return isLoaded ? (
        <div style={{gridColumn: "1"}}>
            <GoogleMap
                mapContainerStyle={props.style}
                center={center}
                zoom={10}
                onLoad={addMarsMapTypes}
                onRightClick={e => {
                    if (props.selected !== null)
                        props.dispatch({type: "deselect", payload: props.selected});
                    setInfoWindow(
                        <Info position={e.latLng.toJSON()} dispatch={props.dispatch} onCloseClick={() => {
                            setInfoWindow(null)
                        }}>
                            <div>
                                <Body1 style={{display: "flex", flexDirection: "column", gap: "5px"}}>
                                    <div>
                                        <Body1Stronger>Latitude:</Body1Stronger> {e.latLng.lat().toFixed(6)}
                                    </div>
                                    <div>
                                        <Body1Stronger>Longitude:</Body1Stronger> {e.latLng.lng().toFixed(6)}
                                    </div>
                                    <Button icon={<ComposeFilled/>} onClick={() => {
                                        // Dispatch temp waypoint
                                        props.dispatch({
                                            type: "writeTemp",
                                            payload: {
                                                // Only location is needed
                                                waypoint_id: -1,
                                                type: WaypointType.STATION,
                                                description: "",
                                                location: {x: e.latLng.lat(), y: e.latLng.lng()},
                                                author: -1
                                            }
                                        })
                                    }}>
                                        Create marker
                                    </Button>
                                </Body1>
                            </div>
                        </Info>
                    )
                }}
                options={{
                    streetViewControl: false,
                    mapTypeControlOptions: {mapTypeIds: ['elevation', 'visible', 'infrared']}
                }}>
                {props.waypoints.map(marker => {
                    return (
                        <div key={marker.waypoint_id}>
                            <Marker position={{lat: marker.location.x, lng: marker.location.y}}
                                    onClick={() => {
                                        props.dispatch({type: 'select', payload: marker});
                                        setInfoWindow(
                                            <Info position={{lat: marker.location.x, lng: marker.location.y}}
                                                  dispatch={props.dispatch}
                                                  onCloseClick={() => {
                                                      props.dispatch({type: 'deselect', payload: marker});
                                                      setInfoWindow(null);
                                                  }}>
                                                <div>
                                                    <h3>{marker.description}</h3>
                                                    <p>Waypoint ID: {marker.waypoint_id}</p>
                                                    <p>Author: {marker.author}</p>
                                                </div>
                                            </Info>);
                                    }}/>
                        </div>);
                })}
                {infoWindow}
            </GoogleMap>
        </div>
    ) : <></>
}
