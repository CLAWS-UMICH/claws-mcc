import React from 'react';
import './Waypoints.css'
import { GoogleMap, InfoBox, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { BaseWaypoint, ManagerAction as MapAction, WaypointType } from "./WaypointManager.tsx";
import { Body1, Body1Stronger, Button } from "@fluentui/react-components";
import { ComposeFilled } from "@fluentui/react-icons";
import waypointImage from '../../assets/waypoint.png';
import { isEqual } from "lodash";

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
        name: m.name.charAt(0).toUpperCase() + m.name.substring(1)
    };

    return new google.maps.ImageMapType(opts);
}

interface WaypointMapProps {
    temp?: BaseWaypoint
    waypoints: BaseWaypoint[];
    selected?: BaseWaypoint;
    dispatch: React.Dispatch<MapAction>;
    EVALocations: Array<object>;
}

export const WaypointMap: React.FC<WaypointMapProps> = props => {
    const [infoWindow, setInfoWindow] = React.useState<React.ReactNode | null>(null);
    const [tempWindow, setTempWindow] = React.useState<React.ReactNode | null>(null);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: key
    })
    const intToChar = (i: number): string => {
        // If i > 26, add another letter.
        if (i > 26) return String.fromCharCode(i / 26 + 65) + String.fromCharCode(i % 26 + 65);
        return String.fromCharCode(i + 65);
    };
    const handleRightClick = (e: google.maps.MapMouseEvent) => {
        const latLng = e.latLng!;
        const lat = latLng.lat().toFixed(5);
        const lng = latLng.lng().toFixed(5);
        setTempWindow(<InfoWindow
            position={latLng}
            onCloseClick={() => setTempWindow(null)}
        >
            <div style={{ display: "flex", flexDirection: "column", width: "max-content", color: "black" }}>
                <div>
                    <Body1Stronger>Latitude: </Body1Stronger>
                    <Body1>{lat}</Body1>
                </div>
                <div>
                    <Body1Stronger>Longitude: </Body1Stronger>
                    <Body1>{lng}</Body1>
                </div>
                <Button
                    onClick={() => {
                        setTempWindow(null);
                        props.dispatch({ type: "deselect" });
                        props.dispatch({
                            type: "writeTemp",
                            payload: {
                                waypoint_id: -1,
                                author: -1,
                                type: WaypointType.NAV,
                                description: "",
                                location: { latitude: Number(lat), longitude: Number(lng) }
                            }
                        });
                    }}
                    icon={<ComposeFilled />}

                >
                    New
                </Button>
            </div>
        </InfoWindow>
        );
    }
    return isLoaded ? (
        <div style={{ gridColumn: "1", padding: '1rem', borderRadius: '15px' }}>
            <GoogleMap
                mapContainerClassName={"map"}
                center={{ lat: 42.27697713747799, lng: -83.73820501490505 }}
                zoom={10}
                onLoad={addMarsMapTypes}
                onRightClick={handleRightClick}
                mapContainerStyle={{ borderRadius: '15px' }}
                options={{
                    streetViewControl: false,
                    mapTypeControlOptions: { mapTypeIds: ['elevation', 'visible', 'infrared'] }
                }}>
                {
                    props.EVALocations.map((location: any) => {
                        return (
                            <Marker
                                key={location.name}
                                label={{ text: location.name, color: "white", fontWeight: "bold" }}
                                position={{ lat: location.posx, lng: location.posy }}
                                icon={waypointImage}
                            />
                        )
                    })
                }
                {props.waypoints.map(marker => {
                    const position = { lat: marker.location.latitude, lng: marker.location.longitude };
                    return (
                        <div key={marker.waypoint_id}>
                            <Marker position={position} clickable={false}
                                label={{ text: intToChar(marker.waypoint_id), color: "white", fontWeight: "bold" }}
                                icon={waypointImage} />
                            <InfoBox
                                position={new google.maps.LatLng(marker.location.latitude, marker.location.longitude)}
                                options={{
                                    closeBoxURL: ``,
                                    enableEventPropagation: true,
                                    pixelOffset: new google.maps.Size(10, -40),
                                    pane: "markerLayer"
                                }}
                                onCloseClick={() => setInfoWindow(null)}>
                                <div className={'info-box'}
                                    style={{ backgroundColor: isEqual(props.selected, marker) ? "grey" : undefined }}>
                                    <Body1Stronger>Waypoint {marker.waypoint_id}</Body1Stronger>
                                    <Body1>{marker.description}</Body1>
                                </div>
                            </InfoBox>
                        </div>);
                })}
                {infoWindow}
                {tempWindow}
            </GoogleMap>
        </div>
    ) : <></>
}
