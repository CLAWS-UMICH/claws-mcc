import Waypoints, {ResponseBody} from "../api/routes/Waypoints";
import express, {Request as ExpressRequest, Response as ExpressResponse} from "express";
import {MongoClient, WithId} from "mongodb";
import WebSocket, {Server as WebSocketServer} from "ws";
import {BaseWaypoint} from "../api/types/Waypoints";


const MONGO_URI = process.env.MONGO_URI as string;

const client = new MongoClient(MONGO_URI);
const initializeTests = async (data: any[]) => {
    const connection = await client.connect();
    const db = connection.db();
    const collection = db.collection('waypoints');
    await collection.insertMany(data);
}

const testData: BaseWaypoint[] = [
    {
        waypoint_id: 1,
        location: {
            latitude: 1,
            longitude: 1
        },
        type: 1,
        description: 'Test waypoint',
        author: -1
    }, {
        waypoint_id: 2,
        location: {
            latitude: 2,
            longitude: 2
        },
        type: 2,
        description: 'Test waypoint 2',
        author: -1
    }];

const tearDownTests = async () => {
    const connection = await client.connect();
    const db = connection.db();
    const collection = db.collection('waypoints');
    await collection.deleteMany({});
    await connection.close();
}

describe('API route', () => {
    describe('Waypoints', () => {
        beforeEach(() => {
            return initializeTests(testData);
        })
        afterEach(() => {
            return tearDownTests();
        })
        const createTestConnection = async (frontendWs: WebSocketServer, holoLensWs: WebSocketServer) => {
            const connection = await client.connect();
            const db = connection.db();
            const server = new Waypoints(db)
            server.setWebSocketInstances(frontendWs, holoLensWs);
            return {db, server};
        }
        describe('Http endpoints', () => {
            test('should delete a waypoint', async () => {
                // Test the delete waypoint function
                const {db, server} = await createTestConnection(
                    new WebSocketServer({noServer: true}), new WebSocketServer({noServer: true}));
                const waypointId = 1;
                const req = {
                    body: {
                        data:
                            {
                                waypoints:
                                    [{
                                        waypoint_id: waypointId,
                                        location: {
                                            latitude: 1,
                                            longitude: 1
                                        },
                                        type: 1,
                                        description: 'Test waypoint',
                                        author: -1
                                    }]
                            }
                    }
                } as ExpressRequest;
                const res = {
                    send: (response: ResponseBody) => {
                        expect(response.message).toBe("Deleted waypoints with ids: [" + waypointId + "]");
                        expect(response.data[0]).toMatchObject(testData[1]);
                    }
                } as ExpressResponse<ResponseBody>;
                return await server.deleteWaypoint(req, res);
            })
            test('should edit a waypoint', async () => {
                // Test the edit waypoint function
                const {db, server} = await createTestConnection(
                    new WebSocketServer({noServer: true}), new WebSocketServer({noServer: true}));
                const waypointId = 1;
                const testWaypoint: BaseWaypoint = {
                    waypoint_id: waypointId,
                    location: {
                        latitude: 100,
                        longitude: 100
                    },
                    type: 1,
                    description: 'Test waypoint',
                    author: -1
                }
                const req = {
                    body: {
                        data:
                            {
                                waypoints:
                                    [testWaypoint]
                            }
                    }
                } as ExpressRequest;
                const res = {
                    send: (response: ResponseBody) => {
                        expect(response.message).toBe("Edited waypoints with ids: [" + waypointId + "]");
                    }
                } as ExpressResponse<ResponseBody>;
                await server.editWaypoint(req, res);
                const waypointsCollection = db.collection('waypoints')
                const editedWaypoint = await waypointsCollection.findOne({waypoint_id: waypointId});
                expect(editedWaypoint).toMatchObject(testWaypoint);
            });
            test('should add a waypoint', async () => {
                // Test the add waypoint function
                const {db, server} = await createTestConnection(
                    new WebSocketServer({noServer: true}), new WebSocketServer({noServer: true}));
                const waypointId = 3;
                const testWaypoint: BaseWaypoint = {
                    waypoint_id: waypointId,
                    location: {
                        latitude: 100,
                        longitude: 100
                    },
                    type: 1,
                    description: 'Test waypoint',
                    author: -1
                }
                const req = {
                    body: {
                        data:
                            {
                                waypoints:
                                    [testWaypoint]
                            }
                    }
                } as ExpressRequest;
                const res = {
                    send: (response: ResponseBody) => {
                        expect(response.message).toBe("Added waypoints with ids: [" + waypointId + "]");
                    }
                } as ExpressResponse<ResponseBody>;
                await server.addWaypoint(req, res);
                const waypointsCollection = db.collection('waypoints')
                const newWaypoint = await waypointsCollection.findOne({waypoint_id: waypointId});
                expect(newWaypoint).toEqual(testWaypoint);
            })
            test('should not add a waypoint with an existing id', async () => {
                const {db, server} = await createTestConnection(
                    new WebSocketServer({noServer: true}), new WebSocketServer({noServer: true}));
                const waypointId = 1;
                const testWaypoint: BaseWaypoint = {
                    waypoint_id: waypointId,
                    location: {
                        latitude: 100,
                        longitude: 100
                    },
                    type: 1,
                    description: 'Test waypoint',
                    author: -1
                }
                const req = {
                    body: {
                        data:
                            {
                                waypoints:
                                    [testWaypoint]
                            }
                    }
                } as ExpressRequest;
                const res = {
                    send: (response: ResponseBody) => {
                        expect(response.message).toBe("Waypoints with ids: [" + waypointId +
                            "] already exist in the database");
                    }
                } as ExpressResponse<ResponseBody>;
                await server.addWaypoint(req, res);
                const waypointsCollection = db.collection('waypoints')
                const newWaypoint = await waypointsCollection.findOne({waypoint_id: waypointId});
                expect(newWaypoint).toEqual(testData[0]);
            })
            test('should only edit waypoints that exist', async () => {
                const {db, server} = await createTestConnection(
                    new WebSocketServer({noServer: true}), new WebSocketServer({noServer: true}));
                const waypointId = 2;
                const testWaypoint: BaseWaypoint = {
                    waypoint_id: waypointId,
                    location: {
                        latitude: 100,
                        longitude: 100
                    },
                    type: 1,
                    description: 'Test waypoint',
                    author: -1
                };
                const nonexistentWaypointId = 4;
                const nonexistentWaypoint: BaseWaypoint = {
                    waypoint_id: nonexistentWaypointId,
                    location: {
                        latitude: 690,
                        longitude: 420
                    },
                    type: 3,
                    description: 'I do not exist',
                    author: 21
                }
                const req = {
                    body: {
                        data:
                            {
                                waypoints:
                                    [testWaypoint, nonexistentWaypoint]
                            }
                    }
                } as ExpressRequest;
                const res = {
                    send: (response: ResponseBody) => {
                        expect(response.message).toBe(`Edited waypoints with ids: [${waypointId}]. ` +
                            `Could not find waypoints with ids: [${nonexistentWaypointId}]`);
                    }
                } as ExpressResponse<ResponseBody>;
                await server.editWaypoint(req, res);
                const waypointsCollection = db.collection('waypoints')
                const newWaypoint = await waypointsCollection.findOne({waypoint_id: nonexistentWaypointId});
                expect(newWaypoint).toBeNull();
            })
            test('should support adding multiple waypoints', async () => {
                const {db, server} = await createTestConnection(
                    new WebSocketServer({noServer: true}), new WebSocketServer({noServer: true}));
                const waypointId = 3;
                const testWaypoint: BaseWaypoint = {
                    waypoint_id: waypointId,
                    location: {
                        latitude: 100,
                        longitude: 100
                    },
                    type: 1,
                    description: 'Test waypoint',
                    author: -1
                };
                const waypointId2 = 4;
                const testWaypoint2: BaseWaypoint = {
                    waypoint_id: waypointId2,
                    location: {
                        latitude: 690,
                        longitude: 420
                    },
                    type: 3,
                    description: 'I do not exist',
                    author: 21
                };
                const req = {
                    body: {
                        data:
                            {
                                waypoints:
                                    [testWaypoint, testWaypoint2]
                            }
                    }
                } as ExpressRequest;
                const res = {
                    send: (response: ResponseBody) => {
                        expect(response.message).toBe(`Added waypoints with ids: [${waypointId}, ${waypointId2}]`);
                    }
                } as ExpressResponse<ResponseBody>;
                await server.addWaypoint(req, res);
                const waypointsCollection = db.collection('waypoints')
                const newWaypoint = await waypointsCollection.find({waypoint_id: {$in: [waypointId, waypointId2]}}).toArray();
                expect(newWaypoint).toEqual([testWaypoint, testWaypoint2]);
            })
            test('should support deleting multiple waypoints', async () => {
                const {db, server} = await createTestConnection(
                    new WebSocketServer({noServer: true}), new WebSocketServer({noServer: true}));
                const waypointId = 1;
                const testWaypoint: BaseWaypoint = {
                    waypoint_id: waypointId,
                    location: {
                        latitude: 1,
                        longitude: 1
                    },
                    type: 1,
                    description: 'Test waypoint',
                    author: -1
                };
                const waypointId2 = 2;
                const testWaypoint2: BaseWaypoint = {
                    waypoint_id: waypointId2,
                    location: {
                        latitude: 2,
                        longitude: 2
                    },
                    type: 2,
                    description: 'Test waypoint 2',
                    author: -1
                };
                const req = {
                    body: {
                        data:
                            {
                                waypoints:
                                    [testWaypoint, testWaypoint2]
                            }
                    }
                } as ExpressRequest;
                const res = {
                    send: (response: ResponseBody) => {
                        expect(response.message).toBe(`Deleted waypoints with ids: [${waypointId}, ${waypointId2}]`);
                    }
                } as ExpressResponse<ResponseBody>;
                await server.deleteWaypoint(req, res);
                const waypointsCollection = db.collection('waypoints')
                const collection = await waypointsCollection.find({waypoint_id: {$in: [waypointId, waypointId2]}}).toArray();
                expect(collection).toEqual([]);
            })
            test('should support editing multiple waypoints', async () => {
                const {db, server} = await createTestConnection(
                    new WebSocketServer({noServer: true}), new WebSocketServer({noServer: true}));
                const waypointId = 1;
                const testWaypoint: BaseWaypoint = {
                    waypoint_id: waypointId,
                    location: {
                        latitude: 100,
                        longitude: 100
                    },
                    type: 1,
                    description: 'Test waypoint',
                    author: -1
                };
                const waypointId2 = 2;
                const testWaypoint2: BaseWaypoint = {
                    waypoint_id: waypointId2,
                    location: {
                        latitude: 690,
                        longitude: 420
                    },
                    type: 3,
                    description: 'I do not exist',
                    author: 21
                };
                const req = {
                    body: {
                        data:
                            {
                                waypoints:
                                    [testWaypoint, testWaypoint2]
                            }
                    }
                } as ExpressRequest;
                const res = {
                    send: (response: ResponseBody) => {
                        expect(response.message).toBe(`Edited waypoints with ids: [${waypointId}, ${waypointId2}]`);
                    }
                } as ExpressResponse<ResponseBody>;
                await server.editWaypoint(req, res);
                const waypointsCollection = db.collection('waypoints')
                const editedWaypoints = await waypointsCollection.find({waypoint_id: {$in: [waypointId, waypointId2]}}).toArray();
                expect(testWaypoint).toEqual({...editedWaypoints[0], _id: undefined});
                expect(testWaypoint2).toEqual({...editedWaypoints[1], _id: undefined});
            })
        })
        describe('Websocket endpoints', () => {
            test('should send waypoints to frontend', () => {
                const waypointId = 3;
                const newWaypoint: BaseWaypoint = {
                    waypoint_id: waypointId,
                    location: {
                        latitude: 300,
                        longitude: 300
                    },
                    type: 1,
                    description: 'Test waypoint 3',
                    author: -1
                }
                const setUpTest = async () => {
                    const frontendWs = new WebSocketServer({noServer: true});
                    const holoLensWs = new WebSocketServer({noServer: true});
                    const app = express();
                    app.use(express.json());
                    const server = app.listen(8000);
                    app.put('/api/waypoints', (req, res) => {
                        const waypointHandler = new Waypoints(client.db());
                        waypointHandler.setWebSocketInstances(frontendWs, holoLensWs);
                        waypointHandler.addWaypoint(req, res);
                    })
                    server.on('upgrade', (req, socket, head) => {
                        frontendWs.handleUpgrade(req, socket, head, (ws) => {
                            frontendWs.emit('connection', ws, req);
                        });
                    })
                    const req = {
                        body: {
                            data:
                                {
                                    waypoints:
                                        [newWaypoint]
                                }
                        }
                    } as ExpressRequest;
                    const test = new WebSocket('ws://localhost:8000/frontend');
                    const receivedMessage = new Promise<WebSocket.RawData>(
                        (resolve) => {
                            test.on('message', message => {
                                resolve(message);
                            })
                        })
                    await fetch('http://localhost:8000/api/waypoints', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(req.body),
                    });
                    return receivedMessage;
                }
                return setUpTest().then(msg => {
                    const response = JSON.parse(msg.toString());
                    expect(response.type).toBe('WAYPOINTS');
                    expect(Array.isArray(response.data)).toBe(true);
                    expect(response.data.length).toBe(3);
                    const parsedData = response.data.map((waypoint: WithId<BaseWaypoint>) => (
                        {...waypoint, _id: waypoint._id.toString('hex')}));
                    expect({...parsedData[0], _id:{}}).toStrictEqual({...testData[0], _id: {}});
                    expect({...parsedData[1], _id:{}}).toStrictEqual({...testData[1], _id: {}});
                    // We don't know what the _id will be for the new waypoint, so we just check that it exists
                    expect(newWaypoint).toEqual({...parsedData[2], _id: undefined});
                });
            })
        })
    })
})