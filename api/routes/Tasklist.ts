import { Request, Response, Router } from "express";
import Base from "../Base";

const tasks: { [key: string]: { title: string,} } = {
	'1': {
		title: 'Task1',
	},
	'2': {
		title: 'Task2',
	}
};

const taskObj: {
	
};

class TaskObj{
    public task_id: number;
    public  status;
    public  title;
    public <SingleAstronaut> astronauts;
    public <Subtask> subtasks;
};

export default class Tasklist extends Base {
	public routes = [
		{
			path: '/api/getTasklist/:astronaut',
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