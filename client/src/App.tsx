import React from 'react';
import './App.css';
import { useState } from 'react';
import axios from 'axios';
import {
  FluentProvider,
  webLightTheme,
  Button
} from "@fluentui/react-components";
import { ButtonTemplate } from './components/common/Button/Button.tsx';
import { CalendarMonthRegular } from "@fluentui/react-icons";
import WaypointMap from './components/WaypointMap.tsx';

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

  // Waypoint list
  //
  const waypoint_list = [
    {
      waypoint_id: 1,
      location: [29.00,-95.00],
      type: 'geo',
      description: 'first waypoint',
      author: 0      
    },
    {
      waypoint_id: 2,
      location: [39.00,-105.00],
      type: 'danger',
      description: 'second waypoint',
      author: 1    
    },
    {
      waypoint_id: 3,
      location: [49.00,-205.00],
      type: 'geo',
      description: 'third waypoint',
      author: 2      
    },
  ]

  return (
    <FluentProvider theme={webLightTheme}>
      <ButtonTemplate icon={<CalendarMonthRegular />} iconPosition="after" text="Button From Template"/>
      <WaypointMap waypoints = {waypoint_list}/>
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
