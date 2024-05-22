import React from 'react';
import rockyardMapBorder from './rockyardMapBorders.png';
import rockyardMap from './rockyardMap.png';

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

    const pointStyle = {
        position: 'absolute' as 'absolute',
        width: '10px',
        height: '10px',
        backgroundColor: 'blue',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)'
    };

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
                    <div style={{ ...pointStyle, top: top_left_point.y, left: top_left_point.x, zIndex: 4 }}></div>
                    <div style={{ ...pointStyle, top: bottom_right_point.y, left: bottom_right_point.x, zIndex: 4 }}></div>
                    <div style={{ ...pointStyle, top: bottom_left_square.y, left: bottom_left_square.x, zIndex: 4 }}></div>
                    <div style={{ ...pointStyle, top: top_right_square.y, left: top_right_square.x, zIndex: 4 }}></div>
                </div>
            </div>
        </div >
    );
}
