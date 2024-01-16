import Message from "./message";

type ARLocation = {
    latitude: number;
    longitude: number;
}

enum WaypointType {
    'STATION',
    'NAV',
    'GEO',
    'DANGER'
}

export type BaseWaypoint = {
    waypoint_id: number; //sequential
    location: ARLocation;
    type: WaypointType;
    description: string;
    author: number; //-1 if mission control created
}

export const isBaseWaypoint = (waypoint: any): waypoint is BaseWaypoint => {
    if (typeof waypoint !== 'object') return false;
    if (!waypoint.hasOwnProperty('waypoint_id')) return false;
    if (!waypoint.hasOwnProperty('location')) return false;
    if (!waypoint.hasOwnProperty('type')) return false;
    if (!waypoint.hasOwnProperty('description')) return false;
    return waypoint.hasOwnProperty('author');
}

export const isMessage = (message: any): boolean => {
    if (typeof message !== 'object') return false;
    if (!message.hasOwnProperty('id')) return false;
    if (!message.hasOwnProperty('type')) return false;
    return message.hasOwnProperty('use');

}

// TODO: Implement
export const isWaypointMessage = (message: Message): boolean => {
    if (!isMessage(message)) return false;
    return false;
}

export interface WaypointsMessage extends Message {
    id: number;
    type: string;
    data: {
        AllMessages: BaseWaypoint[];
    };
}

// Request data is static, only the id changes
export const WaypointRequestMessage = (id: number): Message => (
    {
        id: id,
        type: 'Waypoints',
        use: 'GET',
    }
)
