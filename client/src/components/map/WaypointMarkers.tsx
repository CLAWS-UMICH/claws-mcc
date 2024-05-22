import React from 'react';
import waypointImage from '../../assets/waypoint.png';
import bluewaypoint from '../../assets/bluewaypoint.png';
import greenwaypoint from '../../assets/greenwaypoint.png';
import redwaypoint from '../../assets/redwaypoint.png';
import pinkwaypoint from '../../assets/pinkwaypoint.png';
import rovermarker from '../../assets/rovermarker.png';
import astronautmarker from '../../assets/astronautmarker.png';

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



// TODO: right click add waypoint
export default function WaypointMarkers({ waypoints, MAP_WIDTH, MAP_HEIGHT, plotPoint, ImageWithTextOverlay }) {
    return (
        <>
            {waypoints.map((waypoint, index) => {
                const point = plotPoint(waypoint.location.latitude, waypoint.location.longitude, MAP_WIDTH, MAP_HEIGHT);
                let type = waypoint.type;
                let src_path = ""
                if (type === WaypointType.STATION)
                    src_path = bluewaypoint;
                else if (type === WaypointType.NAV)
                    src_path = pinkwaypoint;
                else if (type === WaypointType.GEO)
                    src_path = greenwaypoint;
                else if (type === WaypointType.DANGER)
                    src_path = redwaypoint;
                return (
                    <div>
                        <ImageWithTextOverlay
                            src={src_path}
                            alt="Waypoint"
                            text={waypoint.waypoint_letter}
                            point={point}
                        />
                    </div>
                );
            })}
        </>
    )
}