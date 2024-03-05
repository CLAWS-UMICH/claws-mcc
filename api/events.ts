import Message from './types/message';

const eventRegistry: { [key: string]: (data: Message) => void } = {
    "VITALS": (data: Message) => {
        console.log(`Received vitals message: ${JSON.stringify(data)}`);
    },
    // Waypoints message from HoloLens
    "PUT": (data: Message) => {
        // TODO: Store data in database and send to frontend
        console.log(`Received PUT message: ${JSON.stringify(data)}`);
    },

    "SAMPLES": (data: Message) => {
        console.log(`Received geosamples message: ${JSON.stringify(data)}`);
    }
};
export default eventRegistry;
