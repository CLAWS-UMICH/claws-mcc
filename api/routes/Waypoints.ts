import {Request, Response} from "express";
import Base, {RouteEvent} from "../Base";
import {WaypointRequestMessage, WaypointsMessage} from "../types/Waypoints";
import {Document, WithId} from "mongodb";
import db from "../core/mongo";

const waypoint = {
    waypoint_id: Number,
    location: {latitude: Number, longitude: Number},
    type: Number,
    description: String,
    author: String,
}

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
        const collection = db.collection('waypoints');
        // loop through waypoints and remove from ones that are already in the database
        // @ts-ignore
        const waypoint_ids = waypoints.map(waypoint => waypoint.waypoint_id);
        const result = collection.find({waypoint_id: {$in: waypoint_ids}});
        for await (const waypoint of result) {
            waypoints.splice(waypoints.indexOf(waypoint), 1);
        }
        // @ts-ignore
        const difference = waypoints.filter(waypoint => waypoint_ids.indexOf(waypoint.waypoint_id) === -1);
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
            res.send("added waypoints: " + waypoints);
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
        const collection = db.collection('waypoints');
        // @ts-ignore
        const waypoint_ids = waypoints.map(waypoint => waypoint.waypoint_id);
        const result = collection.find({waypoint_id: {$in: waypoint_ids}});
        for await (const waypoint of result) {
            waypoints.splice(waypoints.indexOf(waypoint), 1);
        }
        // delete the remaining waypoints from the database
        const deleteResult = await collection.deleteMany(waypoints)
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
            res.send("deleted waypoints: " + waypoints);
        }
    }

    async editWaypoint(req: Request, res: Response) {
        // the request is the array of all the waypoints
        const waypoints = req.body.data.AllWaypoints;
        const collection = db.collection('waypoints');
        // @ts-ignore
        const waypoint_ids = waypoints.map(waypoint => waypoint.waypoint_id);
        // check waypoints for difference between database and request
        for await (const waypoint of collection.find({waypoint_id: {$in: waypoint_ids}}))
            waypoints.splice(waypoints.indexOf(waypoint), 1);
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
                    type: editedWaypoint,
                    description: editedWaypoint.description,
                    author: editedWaypoint.author
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
        res.send("edited waypoints: " + waypoints);
    }
}