import {Request, Response} from "express";
import Base, {RouteEvent} from "../Base";
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

    addWaypoint(req: Request, res: Response) {
        // the request is the array of all the waypoints
        const waypoints = req.body.data.AllWaypoints;
        // loop through waypoints and remove from ones that are already in the database
        for (let i = 0; i < waypoints.length; i++) {
            const waypoint = waypoints[i];
            // check if waypoint is already in database
            if (db.collection('waypoints').findOne({waypoint_id: waypoint.waypoint_id})) {
                // if it is, remove it from the array
                waypoints.splice(i, 1);
            }
        }
        // add the remaining waypoints to the database
        db.collection('waypoints').insertMany(waypoints);
        res.send("added waypoints: " + waypoints);
    }

    deleteWaypoint(req: Request, res: Response) {
        // the request is the array of all the waypoints
        const waypoints = req.body.data.AllWaypoints;
        // check waypoints for difference between database and request
        for (const deletedWaypoint of waypoints) {
            const result = db.collection('waypoints').findOne({waypoint_id: deletedWaypoint.waypoint_id});
            if (result) {
                // Waypoint exists in the collection; it has not been deleted
                waypoints.splice(waypoints.indexOf(deletedWaypoint), 1);
            }
        }
        // delete the remaining waypoints from the database
        db.collection('waypoints').deleteMany(waypoints);
        res.send("deleted waypoints: " + waypoints);
    }

    editWaypoint(req: Request, res: Response) {
        // the request is the array of all the waypoints
        const waypoints = req.body.data.AllWaypoints;
        // check waypoints for difference between database and request
        for (const editedWaypoint of waypoints) {
            const result = db.collection('waypoints').findOne({waypoint_id: editedWaypoint.waypoint_id});
            if (result) {
                // Waypoint exists in the collection; it has not been deleted
                waypoints.splice(waypoints.indexOf(editedWaypoint), 1);
            }
        }
        /// Edit the remaining waypoints in the database
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

            db.collection('waypoints').updateOne(filter, update);
        }
    }
}