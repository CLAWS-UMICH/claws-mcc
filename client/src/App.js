import logo from './assets/logo.png';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
	// text = state variable called text with whatever value
	// setText = function to change the state variable called 'text'
	// useState() = function given by react to initialize a state variable

	const [input, setInput] = useState();

	function callAPI(input) {
		axios.get('/api/getAstronaut/'+input)
		.then((res) => { alert(res.data.name+" has heart rate ="+res.data.heartrate) })
		.catch((res) => { alert(res.response.data) })	
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<br></br><br></br><br></br><br></br><br></br>
				<input type="text"  onChange={setInput} />
				<br></br>
        		<button onClick={() => {callAPI(input.target.value)}}>Submit </button>
			</header>
		</div>
	);
}

export default App;
