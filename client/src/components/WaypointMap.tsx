import React from 'react';
import { useState, useCallback } from 'react';
import axios from 'axios';
import {GoogleMap, Marker, useJsApiLoader, InfoWindow} from '@react-google-maps/api';

const key = "AIzaSyBKoEACDcmaJYjODh0KpkisTk1MPva76s8"; 

const containerStyle = {
    width: '400px',
    height: '400px'
 };
  
const center = {
    lat: -3.745,
    lng: -38.523
};

const options = { 
    mapTypeId: 'satellite',
    disableDefaultUI: true,
}

// Normalizes the coords that tiles repeat across the x axis (horizontally)
// like the standard Google map tiles.
function getNormalizedCoord(coord, zoom) {
  var y = coord.y;
  var x = coord.x;

  // tile range in one direction range is dependent on zoom level
  // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
  var tileRange = 1 << zoom;

  // don't repeat across y-axis (vertically)
  if (y < 0 || y >= tileRange) {
    return null;
  }

  // repeat across x-axis
  if (x < 0 || x >= tileRange) {
    x = (x % tileRange + tileRange) % tileRange;
  }

  return {x: x, y: y};
}

function WaypointMap(props) {
    const { isLoaded } = useJsApiLoader({
      id: 'google-map-script',
      googleMapsApiKey: key
    })
  
    const [map, setMap] = React.useState(null)

    const [selectedMarker, setSelectedMarker] = useState('');
  
    const onLoad = React.useCallback((map) => {
    // This is just an example of getting and using the map instance!!! don't just blindly copy! LOL
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    
    //https://developers.google.com/maps/documentation/javascript/maptypes#CustomMapTypes

    var moonMapType = new google.maps.ImageMapType({
    getTileUrl: function(coord, zoom) {
        var normalizedCoord = getNormalizedCoord(coord, zoom);
        if (!normalizedCoord) {
            return null;
        }
        var bound = Math.pow(2, zoom);
        return '//mw1.google.com/mw-planetary/lunar/lunarmaps_v1/clem_bw' +
            '/' + zoom + '/' + normalizedCoord.x + '/' +
            (bound - normalizedCoord.y - 1) + '.jpg';
    },
    tileSize: new google.maps.Size(256, 256),
    maxZoom: 9,
    minZoom: 0,
    name: 'Moon'
    });

    map.mapTypes.set('moon', moonMapType);
    // map.setMapTypeId('moon');
    
  
    setMap(map)
    }, []);
  
    const onUnmount = React.useCallback(function callback(map) {
      setMap(null)
    }, [])
  
    return isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {props.waypoints.map((marker) => {
            return(
                <div key={marker.waypoint_id}>
                  <Marker 
                    position = {new google.maps.LatLng(marker.location[0], marker.location[1])}
                    onClick={()=>setSelectedMarker(marker)}
                  />
                </div>
            );
        })}

        {selectedMarker  && (
            <InfoWindow position = {new google.maps.LatLng(selectedMarker.location[0], selectedMarker.location[1])} 
                        options = {{pixelOffset: new window.google.maps.Size(0,-40),}}>
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

// waypoint_id: waypoint.waypoint_id,
// location: waypoint.location,
// type: waypoint.type,
// description: waypoint.description,
// author: waypoint.author

