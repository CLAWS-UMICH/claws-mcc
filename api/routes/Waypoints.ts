import { Request, Response } from "express";
import Base, { RouteEvent } from "../Base";
import { BaseWaypoint, isBaseWaypoint, WaypointsMessage } from "../types/Waypoints";
import { Collection, Db, Document, InsertManyResult, WithId } from "mongodb";
import Logger from "../core/logger";

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
        },
    ];
    public events: RouteEvent[] = [
        {
            type: 'GET_WAYPOINTS',
            handler: this.sendWaypoints.bind(this),
        }
    ]
    private collection: Collection<BaseWaypoint>
    private logger = new Logger('Waypoints');

    constructor(db: Db, collection?: Collection<BaseWaypoint>) {
        super(db);
        // If no collection is passed in, use the default one
        this.collection = collection || db.collection<BaseWaypoint>('waypoints');
    }

    async sendWaypoints() {
        const index_collection = this.db.collection('waypoint_current_index');
        var current_index = await index_collection.findOne()
            .then((doc) => {
                if (doc) return doc.index;
                else return 0;
            });
        this.logger.info('receiving waypoints request')
        const allWaypoints = this.collection.find();
        const data = await allWaypoints.toArray();
        const messageId = -1; //TODO: do we send the new waypoints to all the astronauts?
        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'WAYPOINTS',
            use: 'GET',
            data: data,
        })
        this.updateARWaypoints(messageId, data, current_index);
    }

    async addWaypoint(req: Request, res: Response<ResponseBody>): Promise<ResponseBody> {
        let insertResult: InsertManyResult<BaseWaypoint>;
        let message: string;
        let error = false;
        // the request is the array of all the waypoints
        const waypoints = req.body.data["waypoints"];
        // Loop through waypoints, if they dont have a waypoint_id they are being added, assign one with -1 for now
        for (let i = 0; i < waypoints.length; i++) {
            if (waypoints[i].waypoint_id === undefined) {
                waypoints[i].waypoint_id = -1;
            }
        }
        if (!this.isValidRequest(waypoints)) {
            const response: ResponseBody = { error: true, message: "Invalid request", data: [] };
            res.send(response);
            return response;
        }
        const waypointsId = waypoints.map(waypoint => waypoint.waypoint_id);
        // get current_index from config collection
        const config_collection = this.db.collection('waypoint_config');
        var current_index = await config_collection.findOne()
            .then((doc) => {
                if (doc) return doc.current_index;
                else return 0;
            });
        // Get all existing waypoints
        const existingWaypoints = await this.collection.find({ waypoint_id: { $in: waypointsId } }).toArray();
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
                const response: ResponseBody = { error, message, data: [] };
                res.send(response);
                return response;
            }
            // change the waypoint_id and assign waypoint_letter for the new waypoints
            diff.forEach(waypoint => {
                waypoint.waypoint_id = current_index;
                waypoint.waypoint_letter = this.generateWaypointLetter(current_index);
                current_index++;
            });
            // update the current_index in the config collection
            config_collection.updateOne({}, { $set: { current_index: current_index } });
            insertResult = await this.collection.insertMany(diff);
            message = "Waypoints with ids: " +
                // @ts-ignore
                diff.reduce((acc, waypointId) => {
                    return acc + waypointId.waypoint_id.toString(10) + ', ';
                }, '').slice(0, -2)
                + " already exist in the database. Added waypoints with ids";
        }
        // All waypoints sent in request are new
        else {
            // change the waypoint_id and assign waypoint_letter for the new waypoints
            waypoints.forEach(waypoint => {
                waypoint.waypoint_id = current_index;
                waypoint.waypoint_letter = this.generateWaypointLetter(current_index);
                current_index++;
            });
            // update the current_index in the config collection
            config_collection.updateOne({}, { $set: { current_index: current_index } }, { upsert: true });

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
            const response: ResponseBody = { error, message, data: [] };
            this.logger.error(waypoints)
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
        this.updateARWaypoints(messageId, data, current_index);
        const response: ResponseBody = { error: false, message, data };
        res.send(response);
        return response;
    }

    async deleteWaypoint(req: Request, res: Response<ResponseBody>) {
        const config_collection = this.db.collection('waypoint_config');
        var current_index = await config_collection.findOne()
            .then((doc) => {
                if (doc) return doc.current_index;
                else return 0;
            });
        // Waypoint ids to delete
        let toDelete: number[];
        // the request is the array of all the waypoints
        const waypoints = req.body.data["waypoints"]
        if (!this.isValidRequest(waypoints)) {
            const response: ResponseBody = { error: true, message: "Invalid request", data: [] };
            res.send(response);
            return response;
        }
        let error = false;
        // @ts-ignore
        const waypointsId = waypoints.map(waypoint => waypoint.waypoint_id);
        const current_waypoints = await this.collection.find().toArray();
        const current_waypoint_ids = current_waypoints.map(waypoint => waypoint.waypoint_id)
        const requested_waypoints = await this.collection.find({ waypoint_id: { $in: waypointsId } }).toArray();
        const requested_waypoint_ids = requested_waypoints.map(waypoint => waypoint.waypoint_id)

        //calculate diff between original and included
        toDelete = current_waypoint_ids.filter(x => !requested_waypoint_ids.includes(x));

        let message = "Deleted waypoints with ids: [" + toDelete.reduce((acc, waypointId) => {
            return acc + waypointId.toString(10) + ', ';
        }, '').slice(0, -2) + "]";

        //if any waypoint_ids in requested_waypoints are not in current_waypoints, return error
        let result = requested_waypoint_ids.filter(x => !current_waypoint_ids.includes(x));
        if (result.length > 0) {
            message = "Could not find waypoints with ids: [" + result.reduce((acc, waypointId) => {
                return acc + waypointId.toString(10) + ', ';
            }
                , '').slice(0, -2) + "]";
            error = true;
            this.logger.error(message);
        }

        // delete the remaining waypoints from the database
        const deleteResult = await this.collection.deleteMany({ waypoint_id: { $in: toDelete } });
        if (!deleteResult.acknowledged) {
            message = "Could not delete waypoints with ids: [" +
                waypoints.reduce((acc, waypoint) => {
                    return acc + waypoint.waypoint_id.toString(10) + ', ';
                }, '') + "]";
            error = true;
            this.logger.error(message);
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
        this.updateARWaypoints(messageId, data, current_index);
        const response: ResponseBody = { error, message, data };
        res.send(response);
        return response;
    }

    async editWaypoint(req: Request, res: Response<ResponseBody>) {
        const config_collection = this.db.collection('waypoint_config');
        var current_index = await config_collection.findOne()
            .then((doc) => {
                if (doc) return doc.current_index;
                else return 0;
            });
        let message = "";
        let error = false;
        const errors: number[] = [];
        const notFound: number[] = [];
        // the request is the array of all the waypoints
        const waypoints = req.body.data['waypoints'];
        if (!this.isValidRequest(waypoints)) {
            const response: ResponseBody = { error: true, message: "Invalid request", data: [] };
            res.send(response);
            return response;
        }
        // @ts-ignore
        const waypointsId = waypoints.map(waypoint => waypoint.waypoint_id);
        // Edit the remaining waypoints in the database
        for (const editedWaypoint of waypoints) {
            const filter = { waypoint_id: editedWaypoint.waypoint_id };
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
            if (!updateResult.acknowledged) {
                errors.push(editedWaypoint.waypoint_id);
                error = true;
            }
            if (updateResult.matchedCount !== 1)
                notFound.push(editedWaypoint.waypoint_id);
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
        const successfullyEdited = waypointsId.filter(waypointId => !errors.includes(waypointId) && !notFound.includes(waypointId));
        message = "Edited waypoints with ids: [" +
            successfullyEdited.reduce((acc, waypointId) => {
                return acc + waypointId.toString(10) + ', ';
            }, '').slice(0, -2) + "]";
        if (error) {
            message += "Could not edit waypoints with ids: [" +
                errors.reduce((acc, waypointId) => {
                    return acc + waypointId.toString(10) + ', ';
                }, '').slice(0, -2) + "]";
            error = true;
            this.logger.error(message);
        }
        if (notFound.length) {
            message += ". Could not find waypoints with ids: [" +
                notFound.reduce((acc, waypointId) => {
                    return acc + waypointId.toString(10) + ', ';
                }, '').slice(0, -2) + "]";
            error = true;
            this.logger.error(message);
        }
        const response: ResponseBody = { error, message, data };
        this.updateARWaypoints(messageId, data, current_index);
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
    private updateARWaypoints(messageId: number, data: WithId<Document>[], current_index: number): void {
        const waypoints = data.map(waypoint => ({
            waypoint_id: waypoint.waypoint_id,
            location: waypoint.location,
            type: waypoint.type,
            description: waypoint.description,
            author: waypoint.author,
            waypoint_letter: waypoint.waypointLetter
        }));
        const newWaypointsMessage: WaypointsMessage = {
            id: -1, // all astronauts
            type: 'Waypoints',
            use: 'PUT',
            data: {
                AllWaypoints: waypoints,
                currentIndex: current_index
            }
        }
        this.dispatch("AR", newWaypointsMessage)
    }

    private generateWaypointLetter(index: number): string {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const quotient = Math.floor((index - 1) / 26);
        const remainder = (index - 1) % 26;
        return alphabet[quotient - 1] ? alphabet[quotient - 1] + alphabet[remainder] : alphabet[remainder];
    }
}