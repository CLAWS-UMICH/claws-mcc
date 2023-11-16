import { Request, Response, Router } from "express";
import Base from "../Base";

const tasks: { [key: string]: { title: string,} } = {
	'1': {
		title: 'Task1',
	},
	'2': {
		title: 'Task2',
	}
}

export default class Tasklist extends Base {
	public routes = [
		{
			path: '/api/getAstronaut/:astronaut',
			method: 'get',
			handler: this.getTasklist.bind(this),
		}
	];

	getTasklist(req: Request, res: Response) {
		const key: string = req.params.task;
		if (!tasks[key]) {
			res.status(404).send('Astronaut not found');
		}

		return res.send(tasks[key]);
	}
}