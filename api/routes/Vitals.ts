import Base from "../Base";
import Logger from "../core/logger";
import { VitalsMessage } from "../types/Astronaut";

interface Alert {
    code: string;
    message: string;
}

const CURRENT_EVA = process.env.CURRENT_EVA || 'eva2';

export default class Vitals extends Base {
    public events = [
        {
            type: 'VITALS', // to handle incoming messages from hololens (vitals update)
            handler: this.handleVitalsUpdate.bind(this),
        },
        {
            type: 'GET_VITALS', // to handle requesting messages from frontend (vitals get)
            handler: this.sendVitalsMessage.bind(this),
        }
    ]
    public tssFiles = [
        {
            path: '/teams/2/TELEMETRY.json',
            handler: this.handleTSSVitalsUpdate.bind(this),
        }
    ]
    private logger = new Logger('Vitals');

    async handleVitalsUpdate(data: VitalsMessage) {
        const alerts = handleAlerts(data.data);
        this.logger.info('Handling vitals update', data);

        await this.db.collection('vitals').updateOne(
            { id: data.id },
            { $set: { ...data.data, alerts } },
            { upsert: true }
        );

        await this.sendVitalsMessage();
    }

    async handleTSSVitalsUpdate(data: VitalsMessage) {
        this.logger.info('Handling TSS vitals update', data);
    }

    async sendVitalsMessage() {
        this.logger.info("Sending vitals to frontend");
        const allVitals = this.db.collection('vitals').find();
        const vitalsData = await allVitals.toArray();
        const messageId = 0;

        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'VITALS',
            use: 'PUT',
            data: vitalsData,
        });
    }
}

function handleAlerts(data: any) {
    const alerts: Alert[] = [];

    // Primary Oxygen
    if (20 <= data.oxy_pri_storage && data.oxy_pri_storage <= 80) {
        alerts.push({
            code: 'primary_oxygen_normal',
            message: 'Primary oxygen storage within acceptable range',
        });
    }

    // Heart Rate
    if (data.heart_rate < 50 || data.heart_rate > 160) {
        alerts.push({
            code: 'abnormal_heart_rate',
            message: 'Heart rate is outside the normal range',
        });
    }

    // Suit Pressure for O2
    if (600 < data.oxy_pri_pressure && data.oxy_pri_pressure < 3000) {
        alerts.push({
            code: 'swap_to_secondary_oxygen',
            message: 'Swap to secondary oxygen supply',
        });
    } else if (600 < data.oxy_sec_pressure && data.oxy_sec_pressure < 3000) {
        alerts.push({
            code: 'swap_to_primary_oxygen',
            message: 'Swap to primary oxygen supply',
        });
    }

    // Suit Pressure for CO2
    if (0.0 < data.suit_pressure_co2 && data.suit_pressure_co2 < 0.1) {
        alerts.push({
            code: 'vent_co2',
            message: 'Vent out the CO2',
        });
    }

    // Suit Pressure for Other Gases
    if (0.0 < data.suit_pressure_other && data.suit_pressure_other < 0.5) {
        alerts.push({
            code: 'decompress_and_alert',
            message: 'Decompress and alert the user',
        });
    }

    // Suit Pressure Total
    if (3.5 < data.suit_pressure_total && data.suit_pressure_total < 4.5) {
        alerts.push({
            code: 'review_pressure_values',
            message: 'Review other pressure values',
        });
    }

    return alerts;
}