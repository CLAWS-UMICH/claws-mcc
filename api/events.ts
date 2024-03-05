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
    // Geo Samples message to frontend
    "SEND_SAMPLES": (data: Message) => {
        console.log(`Received samples message to frontend: ${JSON.stringify(data)}`);
    },
    // Geo Samples message from Hololens
    "SAMPLES": async (data: Message) => {
        console.log(`Received geosamples message from Hololens: ${JSON.stringify(data)}`);
        const res = await fetch("/api/geosamples", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                data: data.data
            })
        });
        if (!res.ok) {
            alert('Error receiving sample message from hololens');
        }
    },
    // // Geo Samples Zones message from Hololens
    // "SAMPLE_ZONES": async (data: Message) => {
    //     console.log(`Received geosample zones message: ${JSON.stringify(data)}`)
    //     const res = await fetch("/api/geosamples/zones", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Accept": "application/json"
    //         },
    //         body: JSON.stringify({
    //             data: data.data
    //         })
    //     });
    //     if (!res.ok) {
    //         alert('Error receiving sample zones message from hololens');
    //     }
    // }
};
export default eventRegistry;
