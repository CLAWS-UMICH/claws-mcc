import React from 'react';
import astromarker from '../../assets/astronautmarker.png';

export default function EVAMarkers({ EVALocations, MAP_WIDTH, MAP_HEIGHT, plotPoint, ImageWithTextOverlay }) {
    return (
        <>
            {EVALocations.map((eva, index) => {
                const point = plotPoint(eva.lat, eva.long, MAP_WIDTH, MAP_HEIGHT);
                let src_path = astromarker;
                return (
                    <div>
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