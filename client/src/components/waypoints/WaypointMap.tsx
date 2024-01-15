import React, {CSSProperties} from 'react';
import {GoogleMap, InfoBox, InfoWindow, Marker, useJsApiLoader} from '@react-google-maps/api';
import {BaseWaypoint, ManagerAction as MapAction, WaypointType} from "./WaypointManager.tsx";
import {Body1, Body1Stronger} from "@fluentui/react-components";
import {ComposeFilled} from "@fluentui/react-icons";
import {WaypointForm} from "./WaypointList.tsx";

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


const center = {
    lat: 42.27697713747799,
    lng: -83.73820501490505
};

interface WaypointMapProps {
    temp?: BaseWaypoint
    style: CSSProperties
    waypoints: BaseWaypoint[];
    selected?: BaseWaypoint;
    dispatch: React.Dispatch<MapAction>;
}

export const WaypointMap: React.FC<WaypointMapProps> = props => {
    const [infoWindow, setInfoWindow] = React.useState<React.ReactNode | null>(null);
    const [tempWindow, setTempWindow] = React.useState<React.ReactNode | null>(null);
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
                onRightClick={e => {
                    const latLng = e.latLng!;
                    setTempWindow(<InfoWindow position={latLng} onCloseClick={() => setTempWindow(null)}>
                            <div style={{display: "flex", flexDirection: "column", width: "max-content"}}>
                                <div>
                                    <Body1Stronger>Latitude: </Body1Stronger>
                                    <Body1>{latLng.lat().toFixed(5)}</Body1>
                                </div>
                                <div>
                                    <Body1Stronger>Longitude: </Body1Stronger>
                                    <Body1>{latLng.lng().toFixed(5)}</Body1>
                                </div>
                                <WaypointForm
                                    afterSubmit={() => setTempWindow(null)}
                                    waypoint={props.temp!}
                                    temp={{
                                        waypoint_id: -1,
                                        type: WaypointType.NAV,
                                        description: "",
                                        location: {
                                            latitude: latLng.lat(),
                                            longitude: latLng.lng()
                                        },
                                        author: -1
                                    }}
                                    dispatch={props.dispatch}
                                    text={"Create Waypoint"}
                                    buttonProps={{icon: <ComposeFilled/>}}/>
                            </div>
                        </InfoWindow>
                    );
                }}
                options={{
                    streetViewControl: false,
                    mapTypeControlOptions: {mapTypeIds: ['elevation', 'visible', 'infrared']}
                }}>
                {props.waypoints.map(marker => {
                    const position = {lat: marker.location.latitude, lng: marker.location.longitude};
                    const svgMarker: google.maps.Symbol = {
                        path: "M7.79073 6.09108C12.3246 1.5572 19.6755 1.5572 24.2094 6.09108C28.7432 10.625 28.7432 17.9758 24.2094 22.5097L22.6267 24.0749C21.4602 25.2198 19.9467 26.6917 18.0856 28.4912C16.9226 29.6156 15.0775 29.6155 13.9147 28.4908L9.25989 23.963C8.67487 23.3886 8.18518 22.9042 7.79073 22.5097C3.25685 17.9758 3.25685 10.625 7.79073 6.09108ZM22.7951 7.5053C19.0423 3.75247 12.9578 3.75247 9.20494 7.5053C5.45211 11.2581 5.45211 17.3427 9.20494 21.0955L11.1877 23.0521C12.2796 24.1207 13.6522 25.4546 15.3051 27.0532C15.6927 27.4281 16.3077 27.4281 16.6954 27.0533L21.2219 22.6514C21.8472 22.0377 22.3716 21.519 22.7951 21.0955C26.548 17.3427 26.548 11.2581 22.7951 7.5053ZM16 10.6653C18.2103 10.6653 20.0021 12.4571 20.0021 14.6674C20.0021 16.8776 18.2103 18.6694 16 18.6694C13.7898 18.6694 11.998 16.8776 11.998 14.6674C11.998 12.4571 13.7898 10.6653 16 10.6653ZM16 12.6653C14.8943 12.6653 13.998 13.5616 13.998 14.6674C13.998 15.7731 14.8943 16.6694 16 16.6694C17.1058 16.6694 18.0021 15.7731 18.0021 14.6674C18.0021 13.5616 17.1058 12.6653 16 12.6653Z",
                        strokeWeight: props.selected! === marker ? 3 : 1,
                        strokeColor: "white",
                        anchor: new google.maps.Point(16, 32),
                    }
                    return (
                        <div key={marker.waypoint_id}>
                            <Marker position={position} clickable={false} icon={svgMarker}/>
                            <InfoBox
                                position={new google.maps.LatLng(marker.location.latitude, marker.location.longitude)}
                                options={{
                                    closeBoxURL: ``,
                                    enableEventPropagation: true,
                                    pixelOffset: new google.maps.Size(10, -40),
                                    pane: "markerLayer"
                                }}
                                onCloseClick={() => setInfoWindow(null)}>
                                <div style={{
                                    opacity: 0.95,
                                    padding: `12px`,
                                    color: "white",
                                    flexDirection: "column",
                                    display: "flex",
                                    width: "max-content"
                                }}>
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
