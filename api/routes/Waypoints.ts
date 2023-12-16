import {Request, Response} from "express";
import Base, {RouteEvent} from "../Base";
import {WaypointRequestMessage, WaypointsMessage} from "../types/Waypoints";
import {Document, WithId} from "mongodb";

export default class Waypoints extends Base {
    public routes = [
        {
            path: '/api/waypoint',
            method: 'put',
            handler: this.addWaypoint.bind(this),
        },
        {
            path: '/api/waypoint',
            method: 'delete',
            handler: this.deleteWaypoint.bind(this),
        },
        {
            path: '/api/waypoint',
            method: 'post',
            handler: this.editWaypoint.bind(this),
        }
    ];
    public events: RouteEvent[] = [
        {
            type: 'GET',
            handler: (data) => {
                console.log(`Received GET event with data: ${JSON.stringify(data)}`);
            }
        }
    ]

    async addWaypoint(req: Request, res: Response) {
        // the request is the array of all the waypoints
        const waypoints = req.body.data.AllWaypoints;
        const collection = this.db.collection('waypoints');
        // loop through waypoints and remove from ones that are already in the database
        // @ts-ignore
        const waypointsId = waypoints.map(waypoint => waypoint.waypoint_id);
        const result = collection.find({waypoint_id: {$in: waypointsId}});
        for await (const waypoint of result) {
            waypoints.splice(waypoints.indexOf(waypoint), 1);
        }
        // @ts-ignore
        const difference = waypoints.filter(waypoint => waypointsId.indexOf(waypoint.waypoint_id) === -1);
        const insertResult = await collection.insertMany(difference);
        if (insertResult.acknowledged === true && insertResult.insertedCount === difference.length) {
            const allWaypoints = collection.find();
            const data = await allWaypoints.toArray();
            const messageId = -1; //TODO: do we send the new waypoints to all the astronauts?
            this.dispatch('FRONTEND', {
                id: messageId,
                type: 'WAYPOINTS',
                use: 'GET',
                data: data,
            })
            this.updateARWaypoints(messageId, data);
            res.send("added waypoints with ids: " + waypointsId);
        }
        throw new Error(`Could not insert waypoints`);
    }

    // Updates AR with the most recent waypoints. Assumes that the input data is the most up-to-date
    updateARWaypoints(messageId: number, data: WithId<Document>[]): void {
        const waypoints = data.map(waypoint => ({
            waypoint_id: waypoint.waypoint_id,
            location: waypoint.location,
            type: waypoint.type,
            description: waypoint.description,
            author: waypoint.author
        }));
        const newWaypointsMessage: WaypointsMessage = {
            id: messageId,
            type: 'Messaging',
            use: 'PUT',
            data: {
                AllMessages: waypoints
            }
        }
        this.dispatch("AR", newWaypointsMessage)
    }

    // Requests waypoints from AR
    fetchARWaypoints(id: number): void {
        try {
            this.dispatch("AR", WaypointRequestMessage(id));
        } catch (e) {
            console.error(e);
        }
    }

    async deleteWaypoint(req: Request, res: Response) {
        // the request is the array of all the waypoints
        const waypoints = req.body.data.AllWaypoints;
        const collection = this.db.collection('waypoints');
        // @ts-ignore
        const waypointsId = waypoints.map(waypoint => waypoint.waypoint_id);
        const result = collection.find({waypoint_id: {$in: waypointsId}});
        for await (const waypoint of result) {
            if (!waypointsId.includes(waypoint.waypoint_id))
                throw new Error(`Waypoint ${waypoint.waypoint_id} not found`);
        }
        // delete the remaining waypoints from the database
        const deleteResult = await collection.deleteMany({waypoint_id: {$in: waypointsId}})
        if (deleteResult.acknowledged === true && deleteResult.deletedCount === waypoints.length) {
            const allWaypoints = collection.find();
            const data = await allWaypoints.toArray();
            this.dispatch('FRONTEND', {
                id: -1,
                type: 'WAYPOINTS',
                use: 'GET',
                data: data
            })
            this.updateARWaypoints(-1, data);
            res.send("deleted waypoints with ids: " + waypointsId);
        }
    }

    async editWaypoint(req: Request, res: Response) {
        // the request is the array of all the waypoints
        const waypoints = req.body.data.AllWaypoints;
        const collection = this.db.collection('waypoints');
        // @ts-ignore
        const waypointsId = waypoints.map(waypoint => waypoint.waypoint_id);
        // Edit the remaining waypoints in the database
        for (const editedWaypoint of waypoints) {
            const filter = {waypoint_id: editedWaypoint.waypoint_id};
            const update = {
                $set: {
                    waypoint_id: editedWaypoint.waypoint_id,
                    location: {
                        latitude: editedWaypoint.location.latitude,
                        longitude: editedWaypoint.location.longitude
                    },
                    type: editedWaypoint.type,
                    description: editedWaypoint.description,
                }
            }
            const updateResult = await collection.updateOne(filter, update);
            if (!updateResult.acknowledged)
                throw new Error(`Could not update waypoint ${editedWaypoint.waypoint_id}`);
        }
        const allWaypoints = collection.find();
        const data = await allWaypoints.toArray();
        const messageId = -1; //TODO: do we send the new waypoints to all the astronauts?
        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'WAYPOINTS',
            use: 'GET',
            data: data,
        });
        this.updateARWaypoints(messageId, data);
        res.send("edited waypoints with ids: " + waypointsId);
    }
}