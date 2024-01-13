import React, {useState} from 'react';
import './App.css';
import axios from 'axios';
import {FluentProvider, webLightTheme} from "@fluentui/react-components";
import WaypointManager from "./components/waypoints/WaypointManager.tsx";

interface AstronautData {
    heartrate: number;
    // Add more properties if needed
}

function App() {
    const [astronaut, setAstronaut] = useState<string | undefined>(undefined);

    function getAstronaut() {
        if (astronaut) {
            axios.get<AstronautData>(`/api/getAstronaut/${astronaut}`).then((res) => {
                alert(`This astronaut's heartrate is ${res.data.heartrate}`);
            });
        }
    }

    return (
        <FluentProvider theme={webLightTheme}>
            <WaypointManager/>
        </FluentProvider>

        // <Button appearance="primary">Hello Fluent UI React</Button>
        /* UNCOMMENT THIS SECTION IF YOU NEED THE INPUT AND BUTTON PART
          <div className="App">
            <header className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <input onChange={(e) => setAstronaut(e.target.value)} />
              <button onClick={getAstronaut}>Get Astronaut</button>
            </header>
          </div>
        */
    );
}

export default App;
