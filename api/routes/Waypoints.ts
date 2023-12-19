import {Request, Response} from "express";
import Base, {RouteEvent} from "../Base";
import {BaseWaypoint, isBaseWaypoint, WaypointsMessage} from "../types/Waypoints";
import {Collection, Db, Document, InsertManyResult, WithId} from "mongodb";

export interface ResponseBody {
    error: boolean,
    message: string,
    data: WithId<BaseWaypoint>[]
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
    private collection: Collection<BaseWaypoint>

    constructor(db: Db, collection?: Collection<BaseWaypoint>) {
        super(db);
        // If no collection is passed in, use the default one
        this.collection = collection || db.collection<BaseWaypoint>('waypoints');
    }

    async addWaypoint(req: Request, res: Response<ResponseBody>): Promise<ResponseBody> {
        let insertResult: InsertManyResult<BaseWaypoint>;
        let message: string;
        let error = false;
        // the request is the array of all the waypoints
        const waypoints = req.body.data["waypoints"];
        if (!this.isValidRequest(waypoints)) {
            const response: ResponseBody = {error: true, message: "Invalid request", data: []};
            res.send(response);
            return response;
        }
        // @ts-ignore
        const waypointsId = waypoints.map(waypoint => waypoint.waypoint_id);
        // Get all existing waypoints
        const existingWaypoints = await this.collection.find({waypoint_id: {$in: waypointsId}}).toArray();
        const existingWayPointsId = existingWaypoints.map(waypoint => waypoint.waypoint_id);
        // At least one existing waypoint was sent in the request
        if (0 !== existingWaypoints.length) {
            const diff = waypoints.filter(waypoint => !existingWayPointsId.includes(waypoint.waypoint_id))
            // All waypoints sent in request already exist in the database. Trying to insert an empty array will throw an error
            if (0 === diff.length) {
                message = "Waypoints with ids: [" +
                    waypointsId.reduce((acc, waypointId) => {
                        return acc + waypointId.toString(10) + ', ';
                    }, '').slice(0, -2)
                    + "] already exist in the database";
                const response: ResponseBody = {error, message, data: []};
                res.send(response);
                return response;
            }
            insertResult = await this.collection.insertMany(diff);
            message = "Waypoints with ids: " +
                diff.reduce((acc, waypointId) => {
                    return acc + waypointId.waypoint_id.toString(10) + ', ';
                }, '').slice(0, -2)
                + " already exist in the database. Added waypoints with ids";
        }
        // All waypoints sent in request are new
        else {
            insertResult = await this.collection.insertMany(waypoints);
            message = "Added waypoints with ids: [" +
                waypointsId.reduce((acc, waypointId) => {
                    return acc + waypointId.toString(10) + ', ';
                }, '').slice(0, -2) + "]";
        }
        // If not acknowledged, the other fields are undefined
        if (!insertResult.acknowledged) {
            message = "Could not add waypoints";
            error = true;
            const response: ResponseBody = {error, message, data: []};
            console.error(waypoints)
            res.send(response);
            return response;
        }
        if (insertResult.insertedCount !== waypoints.length) {
            message = "Could not add all waypoints";
            error = true;
            const response: ResponseBody = {error, message, data: []};
            // Delete waypoints that were added
            const deleteResult = await this.collection.deleteMany({waypoint_id: {$in: waypointsId}});
            if (!deleteResult.acknowledged) {
                console.error("Could not delete waypoints");
            }
            res.send(response);
            return response;
        }
        // No errors
        const allWaypoints = this.collection.find();
        const data = await allWaypoints.toArray();
        const messageId = -1; //TODO: do we send the new waypoints to all the astronauts?
        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'WAYPOINTS',
            use: 'GET',
            data: data,
        })
        this.updateARWaypoints(messageId, data);
        const response: ResponseBody = {error: false, message, data};
        res.send(response);
        return response;
    }

    async deleteWaypoint(req: Request, res: Response<ResponseBody>) {
        // Waypoint ids to delete
        let toDelete: number[];
        // the request is the array of all the waypoints
        const waypoints = req.body.data["waypoints"]
        if (!this.isValidRequest(waypoints)) {
            const response: ResponseBody = {error: true, message: "Invalid request", data: []};
            res.send(response);
            return response;
        }
        // @ts-ignore
        const waypointsId = waypoints.map(waypoint => waypoint.waypoint_id);
        let message = "Deleted waypoints with ids: [" +
            waypointsId.reduce((acc, waypointId) => {
                return acc + waypointId.toString(10) + ', ';
            }, '').slice(0, -2) + "]";
        let error = false;
        const result = await this.collection.find({waypoint_id: {$in: waypointsId}}).toArray();
        // If some of the waypoints do not exist in the database
        if (waypoints.length !== result.length) {
            const uniqueWpIds = result.map(waypoint => waypoint.waypoint_id);
            const diff = waypoints.filter(wp => !uniqueWpIds.includes(wp.waypoint_id))
            message = "Waypoints with ids: [" +
                diff.reduce((acc, wpId) => {
                    return acc + wpId.waypoint_id.toString(10) + ', ';
                }, '').slice(0, -2)
                + "] do not exist in the database. Deleted waypoints with ids: [" +
                uniqueWpIds.reduce((acc, wpId) => {
                    return acc + wpId.toString(10) + ', ';
                }, '').slice(0, -2) + "]";
            error = true;
            toDelete = uniqueWpIds;
        } else {
            toDelete = waypointsId;
        }
        // delete the remaining waypoints from the database
        const deleteResult = await this.collection.deleteMany({waypoint_id: {$in: toDelete}});
        if (!deleteResult.acknowledged) {
            message = "Could not delete waypoints with ids: [" +
                waypoints.reduce((acc, waypoint) => {
                    return acc + waypoint.waypoint_id.toString(10) + ', ';
                }, '') + "]";
            error = true;
            console.error("Could not delete waypoints: " +
                waypoints.reduce((acc, waypoint) => {
                    return acc + waypoint.waypoint_id.toString(10) + ', ';
                }, ''));
        }
        const allWaypoints = this.collection.find();
        const data = await allWaypoints.toArray();
        const messageId = -1; //TODO: do we send the new waypoints to all the astronauts?
        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'WAYPOINTS',
            use: 'GET',
            data: data,
        });
        this.updateARWaypoints(messageId, data);
        const response: ResponseBody = {error, message, data};
        res.send(response);
        return response;
    }

    async editWaypoint(req: Request, res: Response<ResponseBody>) {
        let message = "";
        let error = false;
        const errors: number[] = [];
        // the request is the array of all the waypoints
        const waypoints = req.body.data['waypoints'];
        if (!this.isValidRequest(waypoints)) {
            const response: ResponseBody = {error: true, message: "Invalid request", data: []};
            res.send(response);
            return response;
        }
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
                    author: editedWaypoint.author
                }
            }
            const updateResult = await this.collection.updateOne(filter, update);
            if (!updateResult.acknowledged && updateResult.matchedCount === 0 && updateResult.modifiedCount === 0) {
                errors.push(editedWaypoint.waypoint_id);
                error = true;
            }
        }
        const allWaypoints = this.collection.find();
        const data = await allWaypoints.toArray();
        const messageId = -1; //TODO: do we send the new waypoints to all the astronauts?
        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'WAYPOINTS',
            use: 'GET',
            data: data,
        });
        if (error) {
            const modified = waypointsId.filter(waypointId => !errors.includes(waypointId));
            message = "Could not edit waypoints with ids: [" +
                errors.reduce((acc, waypointId) => {
                    return acc + waypointId.toString(10) + ', ';
                }, '').slice(0, -2) + "]. Edited waypoints with ids: [" +
                modified.reduce((acc, waypointId) => {
                    return acc + waypointId.toString(10) + ', ';
                }, '').slice(0, -2) + "]";
            console.error(message);
        }
        const noErrorMessage = "Edited waypoints with ids: [" +
            waypointsId.reduce((acc, waypointId) => {
                return acc + waypointId.toString(10) + ', ';
            }, '').slice(0, -2) + "]";
        const response: ResponseBody = error ? {error, message, data} : {error, message: noErrorMessage, data};
        this.updateARWaypoints(messageId, data);
        res.send(response);
        return response;
    }

    // Checks if the incoming request is valid
    private isValidRequest(data: any): data is BaseWaypoint[] {
        if (!Array.isArray(data)) return false;
        return data.every(isBaseWaypoint);
    }

    // Requests waypoints from AR
    // Updates AR with the most recent waypoints. Assumes that the input data is the most up-to-date
    private updateARWaypoints(messageId: number, data: WithId<Document>[]): void {
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

}