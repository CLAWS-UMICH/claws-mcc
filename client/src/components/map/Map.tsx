import React, { useEffect, useState } from 'react';
import rockyardMapBorder from './rockyardMapBorders.png';
import rockyardMap from './rockyardMap.png';
import useDynamicWebSocket from '../../hooks/useWebSocket';
import WaypointMarkers from './WaypointMarkers';
import EVAMarkers from './EVAMarkers';
import { toLatLon } from 'utm';

export enum WaypointType {
    // Blue
    STATION,
    // Pink
    NAV,
    // Green
    GEO,
    // Red
    DANGER
}
export type BaseWaypoint = {
    _id?: number; // server generated
    waypoint_id: number; //sequential
    location: { latitude: number, longitude: number };
    type: WaypointType;
    description: string;
    author: number; //-1 if mission control created
}
const ImageWithTextOverlay = ({ src, alt, text, point }) => {
    const containerStyle: React.CSSProperties = {
        position: 'absolute',
        top: point.y,
        left: point.x,
        zIndex: 4,
        width: '18px',
        height: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const textStyle: React.CSSProperties = {
        position: 'absolute',
        color: 'white', // You can change this to your desired text color
        fontSize: '10px', // Adjust font size as needed
        textAlign: 'center',
    };

    return (
        <div style={containerStyle}>
            <img src={src} alt={alt} style={{ width: '100%', height: '100%' }} />
            <div style={textStyle}>{text}</div>
        </div>
    );
};

export default function Map() {
    const SCALE = 0.16;
    const LARGE_WIDTH = 4251 * SCALE;
    const LARGE_HEIGHT = 3543 * SCALE;
    const MAP_WIDTH = 3839 * SCALE;
    const MAP_HEIGHT = 3069 * SCALE;

    // coords from google maps
    // const topLeft = { lat: 29.565369133556835, long: -95.0819529674787 };
    // const bottomRight = { lat: 29.56440830845782, long: -95.08071056957434 };
    // const bottomLeftSquare = { lat: 29.564939230058076, long: -95.08120752873609 };
    // const topRightSquare = { lat: 29.565157705835315,  long: -95.08070786870931;

    const topLeft = { lat: 29.565369133556835, long: -95.0819529674787 };
    const bottomRight = { lat: 29.56440830845782, long: -95.08071056957434 };
    const bottomLeftSquare = { lat: 29.564939230058076, long: -95.08120752873609 };
    const topRightSquare = { lat: 29.565157705835315, long: -95.08070786870931 };


    const gridRows = 27;
    const gridCols = 33;

    const latRange = Math.abs(Math.abs(topLeft.lat) - Math.abs(bottomRight.lat));
    const longRange = Math.abs(Math.abs(bottomRight.long) - Math.abs(topLeft.long));

    const latPerGrid = latRange / gridRows;
    const longPerGrid = longRange / gridCols;

    console.log("latRange")
    console.log(latRange)
    console.log("longRange")
    console.log(longRange)
    console.log("latPerGrid")
    console.log(latPerGrid)
    console.log("longPerGrid")
    console.log(longPerGrid)


    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
    };

    const relativeContainerStyle = {
        position: 'relative' as 'relative',
        width: LARGE_WIDTH,
        height: LARGE_HEIGHT
    };

    const absoluteImageStyle = {
        position: 'absolute' as 'absolute',
        top: 0,
        left: 0
    };

    // Example points (use the correct coordinates to plot)
    const top_left_point = plotPoint(topLeft.lat, topLeft.long, MAP_WIDTH, MAP_HEIGHT);
    const bottom_right_point = plotPoint(bottomRight.lat, bottomRight.long, MAP_WIDTH, MAP_HEIGHT);
    const bottom_left_square = plotPoint(bottomLeftSquare.lat, bottomLeftSquare.long, MAP_WIDTH, MAP_HEIGHT);
    const top_right_square = plotPoint(topRightSquare.lat, topRightSquare.long, MAP_WIDTH, MAP_HEIGHT);


    console.log("Top left point (pixels):", top_left_point);
    console.log("Bottom right point (pixels):", bottom_right_point);

    function latLongToGrid(lat, long) {
        console.log({ lat, long, topLeft: topLeft.long })
        const latdiff = Math.abs(Math.abs(topLeft.lat) - Math.abs(lat));
        const longdiff = Math.abs(Math.abs(long) - Math.abs(topLeft.long));
        console.log({ latdiff, longdiff, latPerGrid, longPerGrid })
        const row = latdiff / latPerGrid;
        const col = longdiff / longPerGrid;
        console.log({ row, col })
        return { row, col };
    }

    function gridToPixel(gridRow, gridCol, imageWidth, imageHeight) {
        const pixelX = (gridCol / gridCols) * imageWidth;
        const pixelY = (gridRow / gridRows) * imageHeight;
        return { x: pixelX, y: pixelY };
    }

    function plotPoint(lat, long, imageWidth, imageHeight) {
        const gridPos = latLongToGrid(lat, long);
        console.log("Grid position:", gridPos);
        return gridToPixel(gridPos.row, gridPos.col, imageWidth, imageHeight);
    }

    const [waypoints, setWaypoints] = useState<Array<BaseWaypoint>>([]);
    const [EVALocations, setEVALocations] = useState<Array<object>>([
        { name: "EVA1", posx: 0, posy: 0 },
        { name: "EVA2", posx: 0, posy: 0 }
    ]);
    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const { sendMessage, lastMessage, readyState } = useDynamicWebSocket({
        onOpen: () => sendMessage(JSON.stringify({ type: 'GET_WAYPOINTS' })),
        type: 'WAYPOINTS'
    });

    function getWaypointsAndAstros() {
        if (lastMessage !== null) {
            const data = JSON.parse(lastMessage.data);
            if (data?.data?.data?.isLocation) {
                // convert posx and posy from UTM to lat long
                let eva1_posx = data?.data?.imu.eva1.posx;
                let eva1_posy = data?.data?.imu.eva1.posy;

                let eva2_posx = data?.data?.imu.eva2.posx;
                let eva2_posy = data?.data?.imu.eva2.posy;

                let zoneNum = 15;
                let zoneLetter = `R`;
                let northern = true;
                let strict = true;

                let eva_location_1 = toLatLon(eva1_posx, eva1_posy, zoneNum, zoneLetter, undefined, strict);
                let eva_location_2 = toLatLon(eva2_posx, eva2_posy, zoneNum, zoneLetter, undefined, strict);

                let eva1_lat = eva_location_1.latitude;
                let eva1_long = eva_location_1.longitude;

                let eva2_lat = eva_location_2.latitude;
                let eva2_long = eva_location_2.longitude;
                console.log("EVA1 posx: ", eva1_posx)
                console.log("EVA1 posy: ", eva1_posy)
                console.log("EVA1 Lat: ", eva1_lat)
                console.log("EVA1 Long: ", eva1_long)

                console.log("EVA2 posx: ", eva2_posx)
                console.log("EVA2 posy: ", eva2_posy)
                console.log("EVA2 Lat: ", eva2_lat)
                console.log("EVA2 Long: ", eva2_long)
                setEVALocations([
                    {
                        name: "EVA1",
                        lat: eva1_lat,
                        long: eva1_long,
                    },
                    {
                        name: "EVA2",
                        lat: eva2_lat,
                        long: eva2_long,
                    }
                ])
            } else {
                setMessageHistory((prev) => prev.concat(lastMessage.data));
                let data = JSON.parse(lastMessage.data).data;
                setWaypoints(data);
            }
        }
    }



    useEffect(() => {
        getWaypointsAndAstros();
    }, [lastMessage, setMessageHistory]);
    // From TSS
    // teal always
    function AstroMarkers() { }
    // From TSS
    // Orange
    function RoverMarker() { }

    return (
        <div style={containerStyle}>
            <div style={relativeContainerStyle}>
                <img
                    src={rockyardMapBorder}
                    alt="Map Border"
                    width={LARGE_WIDTH}
                    height={LARGE_HEIGHT}
                    style={{ ...absoluteImageStyle, zIndex: 1 }}
                />
                <img
                    src={rockyardMap}
                    alt="Map"
                    width={MAP_WIDTH}
                    height={MAP_HEIGHT}
                    style={{ ...absoluteImageStyle, top: (LARGE_HEIGHT - MAP_HEIGHT) / 2, left: (LARGE_WIDTH - MAP_WIDTH) / 2, zIndex: 2 }}
                />
                <div style={{ ...absoluteImageStyle, top: (LARGE_HEIGHT - MAP_HEIGHT) / 2, left: (LARGE_WIDTH - MAP_WIDTH) / 2, width: MAP_WIDTH, height: MAP_HEIGHT, zIndex: 3 }}>
                    <WaypointMarkers waypoints={waypoints} MAP_WIDTH={MAP_WIDTH} MAP_HEIGHT={MAP_HEIGHT} plotPoint={plotPoint} ImageWithTextOverlay={ImageWithTextOverlay} />
                    <EVAMarkers EVALocations={EVALocations} MAP_WIDTH={MAP_WIDTH} MAP_HEIGHT={MAP_HEIGHT} plotPoint={plotPoint} ImageWithTextOverlay={ImageWithTextOverlay} />
                </div>
            </div>
        </div >
    );
}
