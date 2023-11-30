import { Request, Response } from "express";
import Base from "../Base";
import { VitalsMessage } from "../types/Astronaut";

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
		},
		{
			path: '/api/deleteAstronaut/:astronaut',
			method: 'delete',
			handler: this.deleteAstronaut.bind(this),
		}
	];
	public events = [
		{
			type: 'VITALS',
			handler: this.handleVitalsMessage.bind(this),
		}
	]

	getAstronaut(req: Request, res: Response) {
		const key: string = req.params.astronaut;
		if (!astronauts[key]) {
			res.status(404).send('Astronaut not found');
		}

		return res.send(astronauts[key]);
	}

	deleteAstronaut(req: Request, res: Response) {
		const key: string = req.params.astronaut;
		if (!astronauts[key]) {
			res.status(404).send('Astronaut not found');
		}

		this.dispatch('AR', {
			id: 1,
			type: 'ASTRONAUT',
			requestType: 'DELETE',
			data: { id: 1 },
		});
	}

	async handleVitalsMessage(data: VitalsMessage) {
		// update db if necessary (id is astronaut id, upsert means insert if not found)
		await this.db.collection('vitals').updateOne({ id: data.id }, { $set: data.data }, { upsert: true });

		// .. do what else we want to do with the data

		this.dispatch('FRONTEND', {
			id: data.id,
			type: 'VITALS',
			requestType: 'PUT',
			data: data.data,
		});
	}
}