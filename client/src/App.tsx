import React, {useState} from 'react';
import './App.css';
import axios from 'axios';
import {
    FluentProvider, 
    webDarkTheme, 
    webLightTheme, 
} from "@fluentui/react-components";
import WaypointManager from "./components/waypoints/WaypointManager.tsx";
import NavBar from './components/layout/NavBar/NavBar.tsx';
import Communication from './components/communications/Communication.tsx';

interface AstronautData {
    heartrate: number;
    // Add more properties if needed
}

function App() {
    const [theme, setTheme] = useState(webDarkTheme);
    const [astronaut, setAstronaut] = useState<string | undefined>(undefined);
    const [selectedPage, setSelectedPage] = useState<any>(undefined);


    function getAstronaut() {
        if (astronaut) {
            axios.get<AstronautData>(`/api/getAstronaut/${astronaut}`).then((res) => {
                alert(`This astronaut's heartrate is ${res.data.heartrate}`);
            });
        }
    }

    // Use webDarkTheme by default, but set it to webLightTheme if user prefers light mode.
    window.addEventListener("load", () => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            setTheme(webLightTheme);
        }
    })

    const handleTabSelect = (selectedValue : string) => {
        switch (selectedValue) {
            case 'tasktab':
                break;
            case 'navigationTab':
                setSelectedPage(<WaypointManager/>);
                break;
            case 'vitalsTab':
                break;
            case 'samplesTab':
                break;
            case 'navigationTab':
                break;
            case 'roverTab':
                break;
            case 'suitsTab':
                break;
            case 'messagesTab':
                break;
            case 'connectTab':
                setSelectedPage(<Communication/>);
                break;
            default:
                setSelectedPage(undefined);
                break;
        }
    }

    return (
        <FluentProvider theme={theme}>
            <NavBar onTabSelect={handleTabSelect}/>
            {selectedPage}
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
