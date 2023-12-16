import Waypoints from "../api/routes/Waypoints";
import {Request as ExpressRequest, Response as ExpressResponse} from "express";
import {MongoClient} from "mongodb";
import {Server as WebSocketServer} from "ws";

const MONGO_URI = process.env.MONGO_URI

const client = new MongoClient(MONGO_URI);
const initializeTests = async (data: any[]) => {
    const connection = await client.connect();
    const db = connection.db();
    const collection = db.collection('waypoints');
    await collection.insertMany(data);
}

const testData = [
    {
        waypoint_id: 1,
        location: {
            latitude: 1,
            longitude: 1
        },
        type: 1,
        description: 'Test waypoint'
    }, {
        waypoint_id: 2,
        location: {
            latitude: 2,
            longitude: 2
        },
        type: 2,
        description: 'Test waypoint 2'
    }];

const tearDownTests = async () => {
    const connection = await client.connect();
    const db = connection.db();
    const collection = db.collection('waypoints');
    await collection.deleteMany({});
}

describe('API route', () => {
    describe('Waypoints', () => {
        beforeEach(() => {
            return initializeTests(testData);
        })
        afterEach(() => {
            return tearDownTests();
        })
        test('should delete a waypoint', async () => {
            // Test the delete waypoint function
            const connection = await client.connect();
            const db = connection.db();
            const wssFrontend = new WebSocketServer({noServer: true});
            const wssHoloLens = new WebSocketServer({noServer: true});
            const server = new Waypoints(db);
            const waypointId = 1;
            server.setWebSocketInstances(wssFrontend, wssHoloLens);
            const req = {
                body: {
                    data:
                        {
                            AllWaypoints:
                                [{
                                    waypoint_id: waypointId,
                                    location: {
                                        latitude: 1,
                                        longitude: 1
                                    },
                                    type: 1,
                                    description: 'Test waypoint'
                                }]
                        }
                }
            } as ExpressRequest;
            const res = {
                send: (data: string) => {
                    expect(data).toBe("deleted waypoints with ids: " + waypointId);
                }
            } as ExpressResponse;
            return await server.deleteWaypoint(req, res);
        })
        test('should edit a waypoint', async () => {
            // Test the edit waypoint function
            const connection = await client.connect();
            const db = connection.db();
            const wssFrontend = new WebSocketServer({noServer: true});
            const wssHoloLens = new WebSocketServer({noServer: true});
            const server = new Waypoints(db);
            const waypointId = 1;
            server.setWebSocketInstances(wssFrontend, wssHoloLens);
            const testWaypoint = {
                waypoint_id: waypointId,
                location: {
                    latitude: 100,
                    longitude: 100
                },
                type: 1,
                description: 'Test waypoint'
            }
            const req = {
                body: {
                    data:
                        {
                            AllWaypoints:
                                [testWaypoint]
                        }
                }
            } as ExpressRequest;
            const res = {
                send: (data: string) => {
                    expect(data).toBe("edited waypoints with ids: " + waypointId);
                }
            } as ExpressResponse;
            await server.editWaypoint(req, res);
            const waypointsCollection = db.collection('waypoints')
            const editedWaypoint = await waypointsCollection.findOne({waypoint_id: waypointId});
            editedWaypoint._id = undefined; // Just for testing purposes
            expect(editedWaypoint).toEqual(testWaypoint);
        });
    })
})