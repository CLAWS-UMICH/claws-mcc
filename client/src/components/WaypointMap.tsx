import React from 'react';
import { useState, useCallback } from 'react';
import axios from 'axios';
import {GoogleMap, Marker, useJsApiLoader} from '@react-google-maps/api';

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

function WaypointMap() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: key
      })
        
  return (
    <div className="WaypointMap">
        <h1>Waypoint Map</h1>
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            options={options}
        />
    </div>
  );
}

export default WaypointMap;
