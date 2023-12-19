import Waypoints, {ResponseBody} from "../api/routes/Waypoints";
import {Request as ExpressRequest, Response as ExpressResponse} from "express";
import {MongoClient} from "mongodb";
import {Server as WebSocketServer} from "ws";
import {BaseWaypoint} from "../api/types/Waypoints";

const MONGO_URI = process.env.MONGO_URI

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
        const createTestConnection = async (frontendWs: WebSocketServer, holoLensWs: WebSocketServer) => {
            const connection = await client.connect();
            const db = connection.db();
            const server = new Waypoints(db)
            server.setWebSocketInstances(frontendWs, holoLensWs);
            return {db, server};
        }
        describe('Http endpoints', () => {
            beforeEach(() => {
                return initializeTests(testData);
            })
            afterEach(() => {
                return tearDownTests();
            })
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
                    send: (response) => {
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
                    send: (response) => {
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
                    send: (response) => {
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
                    send: (response) => {
                        expect(response.message).toBe("Waypoints with ids: [" + waypointId +
                            "] already exist in the database");
                    }
                } as ExpressResponse<ResponseBody>;
                await server.addWaypoint(req, res);
                const waypointsCollection = db.collection('waypoints')
                const newWaypoint = await waypointsCollection.findOne({waypoint_id: waypointId});
                expect(newWaypoint).toEqual(testData[0]);
            })
        })
    })
})