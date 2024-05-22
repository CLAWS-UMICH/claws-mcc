import React from 'react';
import astromarker from '../../assets/astronautmarker.png';
import ImageWithTextOverlay from './ImageWithTextOverlay';

export default function EVAMarkers({ EVALocations, MAP_WIDTH, MAP_HEIGHT, plotPoint }) {
    return (
        <>
            {EVALocations.map((eva, index) => {
                const point = plotPoint(eva.lat, eva.long, MAP_WIDTH, MAP_HEIGHT);
                let src_path = astromarker;
                return (
                    <div key={index}>
                        <ImageWithTextOverlay
                            src={src_path}
                            alt="EVA"
                            text={eva.name}
                            point={point}
                        />
                    </div>
                );
            })}
        </>
    )
}