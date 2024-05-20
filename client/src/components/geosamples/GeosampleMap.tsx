import React from "react";
import { Circle, GoogleMap, InfoBox, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import { BaseGeosample, BaseZone, ManagerAction } from "./GeosampleTypes.tsx";
import sampleImage from '../../assets/sampleImage.png';
import starredImage from '../../assets/starredImage.png';
import { Body1, Body1Stronger, Skeleton, makeStyles, Subtitle2Stronger } from "@fluentui/react-components";

const useStyles = makeStyles({
    mapContainer: {
        width: '100%',
        height: '400px',
        marginLeft: '0',
        marginRight: '0',
        marginBottom: '0',
        marginTop: '0'
    },
});

const origin: google.maps.Point = {
    x: 36.25,
    y: 29.5,
    equals: function (other: google.maps.Point | null): boolean {
        if (!other) {
            return false;
        }
        return this.x === other.x && this.y === other.y;
    }
};

const scaleSize: google.maps.Size = {
    height: 70,
    width: 70,
    equals: function (other: google.maps.Size | null): boolean {
        if (!other) {
            return false;
        }
        return this.height === other.height && this.width === other.width;
    }
};

interface GeosampleMapProps {
    geosamples: BaseGeosample[];
    zones: BaseZone[];
    dispatch: React.Dispatch<ManagerAction>;
    ready: boolean;
    selected?: BaseGeosample
};

const API_KEY = "AIzaSyBKoEACDcmaJYjODh0KpkisTk1MPva76s8";
// const API_KEY = "AIzaSyDUzQIxpe2PuzxQdQLtW7NZ3X9mftd6bYE"; this is april's google maps key 

const GeosampleMap: React.FC<GeosampleMapProps> = ({geosamples, zones, dispatch, ready, selected}) => {
    const styles = useStyles();
    const [infoWindow, setInfoWindow] = React.useState<React.ReactNode | null>(null);
    const [zIndices, setZIndices] = React.useState<{ [id: number]: number | undefined }>({});
    const [prevSelected, setPrevSelected] = React.useState<BaseGeosample | null>(null);
    const [circleStyles, setCircleStyles] = React.useState<{ [zone_id: string]: { fillOpacity: number, strokeOpacity: number } }>({});
    const center : google.maps.LatLngLiteral = {lat: 29.564781, lng: -95.081189}
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY,
    });

    React.useEffect(() => {
        const newStyles = {};
        zones.forEach(zone => {
            newStyles[zone.zone_id] = { fillOpacity: 0, strokeOpacity: 0 };
        });
        if (selected) {
            newStyles[selected.zone_id] = { fillOpacity: 0.2, strokeOpacity: 0.7 };
        }
        setCircleStyles(newStyles);
    }, [selected, geosamples]);

    React.useEffect(() => {
        if (selected && (!prevSelected || selected.geosample_id !== prevSelected.geosample_id)) {
            setZIndices(prevState => {
                const newZIndices = {};
                newZIndices[selected.geosample_id] = 999; // Set the zIndex to 999 or any other value you need
                return newZIndices;
            });
            setPrevSelected(selected);
        } 
    }, [selected, prevSelected]);

    const getMarkerLabel = (zoneId: string, id?: number) : string => {
        return id ? zoneId + id.toString() : zoneId;
    };

    if (!ready) {
        return <Skeleton/>;
    };

    const handleRightClick = (e: google.maps.MapMouseEvent, marker: BaseGeosample) => {
        let pos = {lat: e.latLng?.lat(), lng: e.latLng?.lng()}
        if (pos.lat) pos.lat = pos.lat
        if (pos.lng) pos.lng = pos.lng

        const offset : google.maps.Size = {
            height: -66,
            width: 0,
            equals: function (other: google.maps.Size | null): boolean {
                if (!other) {
                    return false;
                }
                return this.height === other.height && this.width === other.width;
            }
        }
        
        setInfoWindow(
            <InfoWindow 
                position={e.latLng ? e.latLng : undefined}
                options={{pixelOffset: offset}}
                onCloseClick={() => setInfoWindow(null)}
            >
                <div style={{display: "flex", flexDirection: "column"}}>
                <Subtitle2Stronger style={{color: "black"}}>
                    {marker.eva_data.name}
                </Subtitle2Stronger>
                <Body1 style={{color: "black"}}>
                    <b>Latitude:</b> {marker.location.latitude}
                </Body1>
                <Body1 style={{color: "black"}}>
                    <b>Longitude:</b> {marker.location.longitude}
                </Body1>
                </div>
            </InfoWindow>
        )
        return;
    }

    return isLoaded ? ( 
    <div key="map" style={{padding: "0.5rem 2rem 2.5rem 2rem"}}>
        <GoogleMap
            mapContainerClassName={styles.mapContainer}
            zoom={20}
            center={selected ? {lat: selected.location.latitude, lng: selected.location.longitude} : center}
            mapTypeId="satellite"
            tilt={0}
            onLoad={() =>    
                    setCircleStyles(prevStyles => {
                    const newStyles = {};
                    zones.forEach(zone => {
                        newStyles[zone.zone_id] = { fillOpacity: 0, strokeOpacity: 0 };
                    });
                    if (selected) newStyles[selected.zone_id] = { fillOpacity: 0.2, strokeOpacity: 0.7 };
                    return newStyles;
                })}
        >
        {geosamples?.map(marker => {
            return (
                <div key={marker.geosample_id}> 
                    <Marker
                        key={marker.id}
                        position={{ lat: marker.location.latitude, lng: marker.location.longitude }}
                        clickable={true}
                        label={{ text: getMarkerLabel(marker.zone_id, marker.id), color: "white", fontWeight: "bold", fontSize: "26px" }}
                        icon={{url: marker.starred ? starredImage : sampleImage, labelOrigin: origin, scaledSize: scaleSize}}                        
                        zIndex={zIndices[marker.geosample_id]}
                        onRightClick={(e) => handleRightClick(e, marker)}
                    />
                </div>
            );
        })}
        {selected && selected?.geosample_id === selected.geosample_id &&                 
            <Circle
                center={{lat: selected.location.latitude+0.000023, lng: selected.location.longitude}}
                radius={4}
                options={{
                    fillColor: "#FFFFFF",
                    fillOpacity: circleStyles[selected.zone_id]?.fillOpacity || 0,
                    strokeColor: "#FFFFFF",
                    strokeWeight: 2,
                    strokeOpacity: circleStyles[selected.zone_id]?.strokeOpacity || 0,
                }}
            />
        }
        {zones?.map(zone => {
            let latlng : google.maps.LatLngLiteral = {lat: zone.location.latitude, lng: zone.location.longitude}
            return (
                <Circle
                    key={zone.zone_id}
                    center={latlng}
                    radius={zone.radius}
                    options={{
                        fillColor: "#A7865E",
                        fillOpacity: circleStyles[zone.zone_id]?.fillOpacity || 0,
                        strokeColor: "#FFFFFF",
                        strokeWeight: 2,
                        strokeOpacity: circleStyles[zone.zone_id]?.strokeOpacity || 0
                    }}
                />
            );
        })}
        {infoWindow}
        </GoogleMap>
    </div>
) : <></>;
}

export default GeosampleMap;
