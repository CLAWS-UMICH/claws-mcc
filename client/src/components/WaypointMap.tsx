import React, {useState} from 'react';
import {GoogleMap, InfoWindow, Marker, useJsApiLoader} from '@react-google-maps/api';

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

const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

type WaypointMarker = {
    waypoint_id: number,
    location: number[], // [lat, lng]
    type: string,
    description: string,
    author: number
}

interface WaypointMapProps {
    waypoints: WaypointMarker[];
}

function WaypointMap(props: WaypointMapProps) {
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: key
    })

    const [selectedMarker, setSelectedMarker] = useState<WaypointMarker | null>(null);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={addMarsMapTypes}
            options={{
                streetViewControl: false,
                mapTypeControlOptions: {
                    mapTypeIds: ['elevation', 'visible', 'infrared']
                }
            }}
        >
            {props.waypoints.map((marker) => {
                return (
                    <div key={marker.waypoint_id}>
                        <Marker
                            position={new google.maps.LatLng(marker.location[0], marker.location[1])}
                            onClick={() => setSelectedMarker(marker)}
                        />
                    </div>
                );
            })}

            {selectedMarker && (
                <InfoWindow position={new google.maps.LatLng(selectedMarker.location[0], selectedMarker.location[1])}
                            options={{pixelOffset: new window.google.maps.Size(0, -40),}}
                            onCloseClick={() => setSelectedMarker(null)}>
                    <div>
                        <h1>Waypoint {selectedMarker.waypoint_id}</h1>
                        <p>Type: {selectedMarker.type}</p>
                        <p>Description: {selectedMarker.description}</p>
                        <p>Author: {selectedMarker.author}</p>
                    </div>
                </InfoWindow>
            )}

        </GoogleMap>
    ) : <></>
}

export default WaypointMap;
