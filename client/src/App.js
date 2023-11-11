import logo from './assets/logo.png';
import './App.css';
import { useState } from 'react';
import axios from 'axios';
import {
	FluentProvider,
	webLightTheme,
	Button
} from "@fluentui/react-components";

function App() {
	const [astronaut, setAstronaut] = useState();

	function getAstronaut() {
		axios.get(`/api/getAstronaut/${astronaut}`).then((res) => {
			alert(`This astronaut's heartrate is ${res.data.heartrate}`);
		});
	}

	return (
		<FluentProvider theme={webLightTheme}>
              <Button appearance="primary">Hello Fluent UI React</Button>
        </FluentProvider>



		/** EXAMPLE FROM SAIF
		 * 
		 * <div className="App">
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
