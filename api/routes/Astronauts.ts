import { Request, Response, Router } from "express";
import Base from "../Base";

const astronauts: { [key: string]: { name: string, heartrate: number } } = {
	'jim': {
		name: 'Jim Harbaugh',
		heartrate: 123,
	},
	'saif': {
		name: 'Saif Alesawy',
		heartrate: 323,
	}
}

export default class Astronauts extends Base {
	public routes = [
		{
			path: '/api/getAstronaut/:astronaut',
			method: 'get',
			handler: this.getAstronaut.bind(this),
		}
	];

	getAstronaut(req: Request, res: Response) {
		const key: string = req.params.astronaut;
		if (!astronauts[key]) {
			res.status(404).send('Astronaut not found');
		}

		return res.send(astronauts[key]);
	}
}