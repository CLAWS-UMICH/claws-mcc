import express from "express";
import * as path from "path";
import * as fs from "fs";
import Route from "./Base";
import { Server as WebSocketServer } from "ws";
import { URL } from 'url';
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import Logger from "./core/logger";
import { IGNORED_TYPES } from "./Base";
import axios from 'axios';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 8000;

const logger = new Logger('Server');
const TSS_URI = process.env.TSS_URI || 'http://127.0.0.1:14141';

if (!process.env.MONGO_URI) {
    logger.error(`No MONGO_URI environment variable found. 
        Please make sure you have a .env file in the root directory of the project with a MONGO_URI variable set to your MongoDB connection string. Exiting..`);
    process.exit(1);
}

const MONGO_URI = process.env.MONGO_URI;

async function connectToMongoDB() {
    try {
        const mongoLogger = new Logger('Mongo');
        mongoLogger.info('Connecting to MongoDB');
        const client = await MongoClient.connect(MONGO_URI);
        mongoLogger.info('Connected to MongoDB');
        return client.db();
    } catch (err) {
        logger.error(`Failed to connect to MongoDB: ${err.message}`);
        process.exit(1);
    }
}

// Load routes from the routes directory
async function loadRoutes(db: any) {
    const routesDirectory = path.join(__dirname, 'routes');
    const files = await fs.promises.readdir(routesDirectory);

    const routeInstances: Route[] = [];
    const eventRegistry: any = {};
    const tssRegistry: any = {};

    for (const file of files) {
        if (path.extname(file) === '.js') {
            try {
                const RouteClass = require(path.join(routesDirectory, file)).default;

                // Instantiate the route class
                const routeInstance = new RouteClass(db) as Route;
                routeInstances.push(routeInstance);

                // Register routes defined in the routeInstance
                if (routeInstance.routes?.length) {
                    for (const route of routeInstance.routes) {
                        app[route.method as Method](route.path, route.handler);
                        logger.info(`Registered route ${route.method.toUpperCase()} ${route.path}`);
                    }
                }

                // Register events defined in the routeInstance
                if (routeInstance.events?.length) {
                    for (const event of routeInstance.events) {
                        eventRegistry[event.type.toUpperCase()] = event.handler;
                        logger.info(`Registered event ${event.type}`);
                    }
                }

                // Register TSS keys defined in the routeInstance
                if (routeInstance.tssFiles?.length) {
                    for (const tssSubscription of routeInstance?.tssFiles) {
                        tssRegistry[tssSubscription.path] = tssRegistry[tssSubscription.path] ?? [];
                        tssRegistry[tssSubscription.path].push(tssSubscription.handler);
                        logger.info(`Registered TSS file ${tssSubscription.path}.json for route ${file}`);
                    }
                }
            } catch (err) {
                logger.error(`Failed to load route ${file}: ${err.message}`);
            }
        }
    }

    logger.info(`Initialized ${routeInstances.length} routes and ${Object.keys(eventRegistry).length} events`);
    return { routeInstances, eventRegistry, tssRegistry };
}

// Set up WebSocket servers
function setupWebSocketServers(server: any, routeInstances: Route[], eventRegistry: any) {
    const wssFrontend = new WebSocketServer({ noServer: true });
    const wssHoloLens = new WebSocketServer({ noServer: true });
    const wssVega = new WebSocketServer({ noServer: true });

    server.on('upgrade', (request: any, socket: any, head: any) => {
        const pathname = new URL(request.url as string, `http://${request.headers.host}`).pathname;

        if (pathname === '/frontend') {
            wssFrontend.handleUpgrade(request, socket, head, (ws) => {
                wssFrontend.emit('connection', ws, request);
            });
        } else if (pathname === '/hololens') {
            wssHoloLens.handleUpgrade(request, socket, head, (ws) => {
                wssHoloLens.emit('connection', ws, request);
            });
        } else if (pathname === '/vega') {
            wssVega.handleUpgrade(request, socket, head, (ws) => {
                wssVega.emit('connection', ws, request);
            });
        } else {
            socket.destroy();
        }
    });

    wssFrontend.on('connection', (sock, request) => {
        logger.info('Frontend WebSocket connection established');
        sock.on("message", (message) => {
            if (message.toString() === 'ping') {
                sock.send('hello frontend - lmcc');
                logger.info('pinged frontend');
                return;
            }
            const data = JSON.parse(message.toString());
            if (!IGNORED_TYPES.includes(data.type)) {
                logger.info(`Received message from FrontEnd: ${data.type || JSON.stringify(data)}`);
            }

            if (eventRegistry[data.type.toUpperCase()]) {
                eventRegistry[data.type.toUpperCase()](data);
            }
        });
    });

    wssHoloLens.on('connection', (sock, request) => {
        logger.info('HoloLens WebSocket connection established');
        sock.on('message', (message) => {
            if (message.toString() === 'ping') {
                sock.send('hello hololens - lmcc');
                logger.info('pinged hololens');
                return;
            }

            const data = JSON.parse(message.toString());
            if (!IGNORED_TYPES.includes(data.type)) {
                logger.info(`Received message from HoloLens: ${data.type || JSON.stringify(data)}`);
            }

            // Call the handler for the event type
            if (eventRegistry[data.type.toUpperCase()]) {
                eventRegistry[data.type.toUpperCase()](data);
            }
        });
    });

    wssVega.on('connection', (sock, request) => {
        logger.info('VEGA WebSocket connection established');
        sock.on('message', (message) => {
            if (message.toString() === 'ping') {
                sock.send('hello vega - lmcc');
                logger.info('pinged vega');
                return;
            }

            const data = JSON.parse(message.toString());
            if (!IGNORED_TYPES.includes(data.type)) {
                logger.info(`Received message from VEGA: ${data.type || JSON.stringify(data)}`);
            }

            // Call the handler for the event type
            if (eventRegistry[data.type.toUpperCase()]) {
                eventRegistry[data.type.toUpperCase()](data);
            }
        });
    });

    // Set the WebSocket instances on each route instance
    for (const routeInstance of routeInstances) {
        routeInstance.setWebSocketInstances(wssFrontend, wssHoloLens, wssVega);
    }
}

async function setupTSSWatchers(tssRegistry: TSSRegistry) {
    const tssLogger = new Logger('TSS');
    const prevTSSData: any = {};

    tssLogger.info(`Watching TSS files: ${Object.keys(tssRegistry).join(', ')}`);

    async function checkTSSData() {
        for (const path in tssRegistry) {
            const handlers = tssRegistry[path];
            const url = `${TSS_URI}/json_data${path}`;

            try {
                const res = await axios.get(url);
                if (res.status !== 200) {
                    throw new Error(`Failed to fetch TSS data for ${url}: ${res.statusText}`);
                }
                const tssData = res.data;
                if (JSON.stringify(tssData) !== JSON.stringify(prevTSSData[path])) {
                    // tssLogger.info(`TSS data for ${url} has changed, calling all handlers`);
                    handlers.forEach((handler) => handler({ ...tssData }));
                }
                // } else {
                    // tssLogger.info(`TSS data for ${url} has not changed`);
                // }

                prevTSSData[path] = tssData;
            } catch (err) {
                tssLogger.error(`Failed to fetch TSS data for ${url}: ${err.message}`);
            }
        }

        setTimeout(checkTSSData, 1000);
    }

    checkTSSData();
}

async function startServer() {
    // Connect to mongo first
    const db = await connectToMongoDB();
    const { routeInstances, eventRegistry, tssRegistry } = await loadRoutes(db);

    // Serve the files for our built React app
    app.use(express.static(path.resolve(__dirname, '../../client/build')));

    app.get('*', (req, res, next) => {
        logger.info(`Request received: ${req.method} ${req.path}`);
        next();
    });

    app.get('/api/test', (req, res) => {
        res.send('Hello from the server!');
    });

    // All other GET requests not handled before will return our React app
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
    });

    const server = app.listen(port, () => {
        logger.info(`Server listening on port ${port}`);
    });

    setupWebSocketServers(server, routeInstances, eventRegistry);
    setupTSSWatchers(tssRegistry);
}

startServer().catch((err) => {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
});

type Method = 'get' | 'post' | 'put';
type TSSRegistry = { [path: string]: any[] };