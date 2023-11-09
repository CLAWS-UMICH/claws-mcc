import { Request, Response, Router } from "express";
import Base from "../Base";
import db  from "../core/mongo";

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