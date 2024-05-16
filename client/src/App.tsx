import React, { useState } from 'react';
import './App.css';
import axios from 'axios';
import { FluentProvider, webDarkTheme, webLightTheme } from "@fluentui/react-components";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import WaypointManager from "./components/waypoints/WaypointManager.tsx";
import GeosampleManager from './components/geosamples/Geosamples.tsx';
import NavBar from './components/layout/NavBar/NavBar.tsx';
import SuitControls from './components/suit_controls/SuitControls.tsx';
import Communication from './components/communications/Communication.tsx';
import CameraView from './components/camera_view/CameraView.tsx';
import EmptyComponent from './components/common/EmptyComponent.tsx';
import { TaskList } from './components/features/task-list.tsx';

interface AstronautData {
  heartrate: number;
}

function App() {
  const [theme, setTheme] = useState(webDarkTheme);
  const [astronaut, setAstronaut] = useState<string | undefined>(undefined);

  function getAstronaut() {
    if (astronaut) {
      axios.get<AstronautData>(`/api/getAstronaut/${astronaut}`).then((res) => {
        alert(`This astronaut's heartrate is ${res.data.heartrate}`);
      });
    }
  }

  return (
    <FluentProvider theme={theme}>
        <BrowserRouter>
            <div className='debug'>
                <CameraView />
                <div className='content-container'>
                    <NavBar />
                    <div>
                      <Routes>
                          <Route path="/" element={<EmptyComponent />} />
                          <Route path="/tasks" element={<TaskList />} />
                          <Route path="/vitals" element={<SuitControls/>} />
                          <Route path="/samples" element={<GeosampleManager />} />
                          <Route path="/navigation" element={<WaypointManager />} />
                          <Route path="/rover" element={<EmptyComponent />} />
                          <Route path="/suits" element={<EmptyComponent />} />
                          <Route path="/messages" element={<EmptyComponent />} />
                          <Route path="/connect" element={<Communication />} />
                      </Routes>
                    </div>
                </div>
            </div>
        </BrowserRouter>
    </FluentProvider>
  );
}

export default App;