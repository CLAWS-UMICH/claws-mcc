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
	// text = state variable called text with whatever value
	// setText = function to change the state variable called 'text'
	// useState() = function given by react to initialize a state variable
	const [text, setText] = useState();
	const [astronaut, setAstronaut] = useState();

	function callAPI() {
		axios.get('/api/hello').then((res) => {
			setText(res.data);
		});
	}

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
