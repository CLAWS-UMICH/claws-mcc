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

type ARWaypoint = {
    waypoint_id: number; //sequential
    location: ARLocation;
    type: WaypointType;
    description: string;
    author: number; //-1 if mission control created
}

export const isMessage = (message: any): boolean => {
    if (typeof message !== 'object') return false;
    if (!message.hasOwnProperty('id')) return false;
    if (!message.hasOwnProperty('type')) return false;
    return message.hasOwnProperty('use');

}

export const isWaypointMessage = (message: Message): boolean => {
    if (!isMessage(message)) return false;
    if (message.type !== 'Waypoints') return false;
}

export interface WaypointsMessage extends Message {
    id: number;
    type: string;
    data: {
        AllMessages: ARWaypoint[];
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
