import express from "express";
import * as path from "path";
import * as fs from "fs";
import Route from "./Base";
import {Server as WebSocketServer} from "ws";
import {URL} from 'url';
import dotenv from "dotenv";
import {MongoClient} from "mongodb";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const port = process.env.PORT || 8000;

// serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../client/build')));

const routesDirectory = path.join(__dirname, 'routes');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdbname';

const client = new MongoClient(MONGO_URI);
client.connect().then(() => {
        const db = client.db();
        fs.readdir(routesDirectory, (err, files) => {
            if (err) {
                console.error(`Error reading routes directory: ${err.message}`);
                return;
            }

            app.get('*', (req, res, next) => {
                console.log(`Request received: ${req.method} ${req.path}`);
                next();
            });

            const routeInstances: Route[] = [];
            const eventRegistry: any = {};

            for (const file of files) {
                if (path.extname(file) === '.js') {
                    try {
                        const RouteClass = require(path.join(routesDirectory, file)).default;

                        // Instantiate the route class
                        const routeInstance = new RouteClass(db) as Route;
                        routeInstances.push(routeInstance);

                        // Register routes defined in the routeInstance
                        for (const route of routeInstance.routes) {
                            // e.g. app.get('/api/getAstronaut/:astronaut', handlerFunction)
                            app[route.method as Method](route.path, route.handler);
                        }
                        // Register events defined in the routeInstance
                        for (const event of routeInstance.events) {
                            // e.g. eventMap['VITALS'] = handlerFunction
                            eventRegistry[event.type.toUpperCase()] = event.handler;
                        }
                    } catch (err) {
                        console.error(`Failed to load route ${file}: ${err.message}`);
                    }
                }
            }
            console.log(eventRegistry);

            app.get('/api/test', (req, res) => {
                res.send('Hello from the server!');
            })

            // All other GET requests not handled before will return our React app
            app.get('*', (req, res) => {
                res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
            });

            // start the web server
            const server = app.listen(port, () => {
                console.log(`Server listening on port ${port}`);
            });

            // start the websocket server
            const wssFrontend = new WebSocketServer({noServer: true});
            const wssHoloLens = new WebSocketServer({noServer: true});

            // so anything can now connect to us via ws://localhost:8000/frontend or ws://localhost:8000/hololens
            server.on('upgrade', (request, socket, head) => {
                const pathname = new URL(request.url as string, `http://${request.headers.host}`).pathname;

                if (pathname === '/frontend') {
                    wssFrontend.handleUpgrade(request, socket, head, (ws) => {
                        wssFrontend.emit('connection', ws, request);
                    });
                } else if (pathname === '/hololens') {
                    wssHoloLens.handleUpgrade(request, socket, head, (ws) => {
                        wssHoloLens.emit('connection', ws, request);
                    });
                } else {
                    socket.destroy();
                }
            });

            // Initialize frontend WS server
            wssFrontend.on('connection', (sock, request) => {
                console.log('Frontend WebSocket connection established');
                sock.on("message", (message) => {
                    const data = JSON.parse(message.toString());

                    console.log(`Received message from FrontEnd: ${data.type || JSON.stringify(data)}`);
                    // call the handler for the event type
                    if (eventRegistry[data.type.toUpperCase()]) {
                        eventRegistry[data.type](data.data);
                    }
                });
            });

            // Frontend doesn't dispatch events to the backend, so we don't need to register any event handlers

            // Initialize HoloLens WS server
            wssHoloLens.on('connection', (sock, request) => {
                console.log('HoloLens WebSocket connection established');
                sock.on('message', (message) => {
                    const data = JSON.parse(message.toString());

                    console.log(`Received message from HoloLens: ${data.type || JSON.stringify(data)}`);

                    // call the handler for the event type
                    if (eventRegistry[data.type.toUpperCase()]) {
                        eventRegistry[data.type](data.data);
                    }
                })
            });
            // wssHoloLens.on('message', (message) => {
            //     const data = JSON.parse(message.toString());

            //     console.log(`Received message from HoloLens: ${data.type || JSON.stringify(data)}`);

            //     // call the handler for the event type
            //     if (eventRegistry[data.type.toUpperCase()]) {
            //         eventRegistry[data.type](data.data);
            //     }
            // });

            // Set the WebSocket instances on each route instance
            for (const routeInstance of routeInstances) {
                routeInstance.setWebSocketInstances(wssFrontend, wssHoloLens);
            }
        });
        console.log('Connected to MongoDB');
    }
)


type Method = 'get' | 'post' | 'put';