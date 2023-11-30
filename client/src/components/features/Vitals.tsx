import WebSocket from 'ws';
import React, { useEffect, useState } from 'react';
import { VitalsMessage } from '../../../../api/types/Astronaut';

export function Vitals() {
    const [vitals, setVitals] = useState<Array<VitalsMessage>>([]);
  
    useEffect(() => {
        // Initialize websocket connection
        const ws = new WebSocket('ws://localhost:8000/frontend');

        ws.on('error', console.error);

        // When receiving a message from the backend, process it
        ws.on('message', (msg) => {
            // Parse it as JSON (that's the data type we're receiving)
            const data = JSON.stringify(msg) as unknown as VitalsMessage;

            // Only care about messages with typ VITALS
            if (data.type == 'VITALS') {
                // have to copy state variable to modify because we can't directly
                // modify state variables
                const existingVitals = [ ...vitals ];
                // find the index of the astronaut we're updating
                const astronautVitalsIndex = vitals?.findIndex(a => a.id == data.id) || -1;
                
                // If we found it, update it based on the index
                if (astronautVitalsIndex !== -1) {
                    existingVitals[astronautVitalsIndex] = data;
                } else { // If it doesn't exist (which will only happen initially), push it
                    existingVitals.push(data);
                }

                // Set the state variable to the copy we made and modified
                setVitals(existingVitals);
            }
          });
    }, []);

    return (
        <div>
            <h3>Vitals</h3>
            <p>
                {vitals.map(d => (
                    <li key={d.id}>
                        Astronaut #{d.id}
                        {d.data.heart_rate} BPM 
                        {d.data.o2_pressure} mmHg 
                        {d.data.battery_percentage}  


                    </li>
                ))} 

            </p>
        </div>
    );
}