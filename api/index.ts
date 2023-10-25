import express from "express";
import * as path from "path";
import * as fs from "fs";
import Route from "./Route";
import dotenv from "dotenv";
dotenv.config();

type Method = 'get' | 'post' | 'put';

const app = express();
const port = process.env.PORT || 8000;

// serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../client/build')));

const routesDirectory = path.join(__dirname, 'routes');

fs.readdir(routesDirectory, (err, files) => {
	if (err) {
        console.error(`Error reading routes directory: ${err.message}`);
        return;
    }

	app.get('*', (req, res, next) => {
		console.log(`Request received: ${req.method} ${req.path}`);
		next();
	});

	for (const file of files) {
		if (path.extname(file) === '.js') {
			try {
				const RouteClass = require(path.join(routesDirectory, file)).default;

				// Instantiate the route class
				const routeInstance = new RouteClass() as Route;

				// Register routes defined in the routeInstance
				for (const route of routeInstance.routes) {
					// e.g. app.get('/api/getAstronaut/:astronaut', handlerFunction)
					app[route.method as Method](route.path, route.handler);
				}
				
			} catch (err) {
				console.error(`Failed to load route ${file}: ${err.message}`);
			}
		}
	}

	app.get('/api/test', (req, res) => {
		res.send('Hello from the server!');
	})

	// All other GET requests not handled before will return our React app
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
	});

	// start the web server
	app.listen(port, () => {
		console.log(`Server listening on port ${port}`);
	});
});
