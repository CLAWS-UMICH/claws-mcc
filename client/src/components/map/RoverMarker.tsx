import React from 'react';
import rovermarker from '../../assets/rovermarker.png';
import ImageWithTextOverlay from './ImageWithTextOverlay';

export default function RoverMarker({ RoverLocation, MAP_WIDTH, MAP_HEIGHT, plotPoint }) {
    const point = plotPoint(RoverLocation.lat, RoverLocation.long, MAP_WIDTH, MAP_HEIGHT);
    let src_path = rovermarker;
    return (
        <>
            <div>
                <ImageWithTextOverlay
                    src={src_path}
                    alt="Rover"
                    text={RoverLocation.qr_id}
                    point={point}
                />
            </div>
        </>
    )
}