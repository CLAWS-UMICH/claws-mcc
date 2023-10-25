import logo from './assets/logo.png';
import './App.css';
import { useState } from 'react';
import axios from 'axios';

function App() {
	// text = state variable called text with whatever value
	// setText = function to change the state variable called 'text'
	// useState() = function given by react to initialize a state variable
	const [text, setText] = useState();

	function callAPI() {
		axios.get('/api/hello').then((res) => {
			setText(res.data);
		})
	}

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					{text}
				</p>
				<a
					className="App-link"
					onClick={callAPI}
					rel="noopener noreferrer"
				>
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
