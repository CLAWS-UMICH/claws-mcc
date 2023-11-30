import Base from "../Base";
import { VitalsMessage } from "../types/Astronaut";

export default class Vitals extends Base {
	public events = [
		{
			type: 'VITALS',
			handler: this.handleVitalsMessage.bind(this),
		}
	]

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