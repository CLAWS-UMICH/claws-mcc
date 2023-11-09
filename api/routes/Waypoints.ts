import { Request, Response, Router } from "express";
import Base from "../Base";
import db  from "../core/mongo";

export default class Waypoints extends Base {
	public routes = [
		{
			path: '/api/Waypoints',
			method: 'get',
			handler: this.getWaypoints.bind(this),
		},
		{
			path: '/api/addWaypoint',
			method: 'put',
			handler: this.addWaypoint.bind(this),
		},
		{
			path: '/api/deleteWaypoint',
			method: 'delete',
			handler: this.deleteWaypoint.bind(this),
		},
		{
			path: '/api/editWaypoint',
			method: 'post',
			handler: this.editWaypoint.bind(this),
		}
	];


	getWaypoints(req: Request, res: Response) {
		// return all waypoints from the collection
		return res.send(db.collection('waypoints').find().toArray());
	}

	addWaypoint(req: Request, res: Response) {
		// const waypoint: string = req.params.waypoint;
	}

	deleteWaypoint(req: Request, res: Response) {
		// const waypoint: string = req.params.waypoint;	
	}

	editWaypoint(req: Request, res: Response) {
		// const waypoint: string = req.params.waypoint;	
	}
}