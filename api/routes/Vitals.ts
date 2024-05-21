import Base from "../Base";
import Logger from "../core/logger";
import { VitalsMessage } from "../types/Astronaut";

interface Alert {
    code: string;
    message: string;
}

const CURRENT_EVA = process.env.CURRENT_EVA || 'eva2';

export default class Vitals extends Base {
    private vitals: any = {
        dcu: {
            batt: false,
            oxy: false,
            comm: false,
            fan: false,
            pump: false,
            co2: false,
        }
    };
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
        },
        {
            path: '/DCU.json',
            handler: this.handleDCUUpdate.bind(this),
        }
    ]
    private logger = new Logger('Vitals');

    async handleVitalsUpdate(data: VitalsMessage) {
        const alerts = handleAlerts(data.data);
        if (!data?.data) {
            return;
        }

        await this.db.collection('vitals').updateOne(
            { id: data.id },
            { $set: { ...data.data, alerts } },
            { upsert: true }
        );
        this.vitals = {
            ...this.vitals,
            ...data.data
        };

        await this.sendVitalsMessage();
    }

    async handleTSSVitalsUpdate(data: VitalsMessage) {
        const eva_data = data["telemetry"][CURRENT_EVA];

        this.logger.info('Handling TSS vitals update', eva_data);

        await this.handleVitalsUpdate({
            id: -1,
            type: 'VITALS',
            use: 'PUT',
            data: eva_data,
        });
    }

    async handleDCUUpdate(data) {
        const dcu_data = data["dcu"];

        this.logger.info('Handling TSS DCU update', dcu_data);

        await this.handleVitalsUpdate({
            id: -1,
            type: 'VITALS',
            use: 'PUT',
            data: { 
                ...this.vitals, 
                dcu: {
                    ...this.vitals.dcu, // Retain existing dcu data
                    ...dcu_data // Update with new dcu data
                } 
            },
        });
    }

    async sendVitalsMessage() {
        this.logger.info("Sending vitals to frontend" + JSON.stringify(this.vitals));
        const vitalsData = this.vitals;
        const messageId = 0;

        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'VITALS',
            use: 'PUT',
            data: { tss_data: this.vitals },
        });
    }
}

function handleAlerts(data: any) {
    const alerts: Alert[] = [];

    if (!data) {
        return [];
    }

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

function convertData(data) {
    return {
        room_id: 0, // This should be set based on your application's context
        is_running: false, // This should be set based on your application's context
        is_paused: false, // This should be set based on your application's context
        time: 0, // This should be set based on your application's context
        timer: "", // This should be set based on your application's context
        started_at: "", // This should be set based on your application's context
        primary_oxygen: data.oxy_pri_storage,
        secondary_oxygen: data.oxy_sec_storage,
        suit_pressure: data.suit_pressure_total,
        sub_pressure: 0, // This should be set based on your application's context
        o2_pressure: data.oxy_pri_pressure,
        o2_rate: data.oxy_consumption,
        h2o_gas_pressure: data.coolant_gas_pressure,
        h2o_liquid_pressure: data.coolant_liquid_pressure,
        sop_pressure: 0, // This should be set based on your application's context
        sop_rate: 0, // This should be set based on your application's context
        heart_rate: data.heart_rate,
        fan_tachometer: data.fan_pri_rpm,
        battery_capacity: 0, // This should be set based on your application's context
        temperature: data.temperature,
        battery_time_left: data.batt_time_left,
        o2_time_left: data.oxy_time_left,
        h2o_time_left: "", // This should be set based on your application's context
        battery_percentage: 0, // This should be set based on your application's context
        battery_outputput: 0, // This should be set based on your application's context
        oxygen_primary_time: 0, // This should be set based on your application's context
        oxygen_secondary_time: 0, // This should be set based on your application's context
        water_capacity: data.coolant_ml,
        dcu: {
            batt: false,
            oxy: false,
            comm: false,
            fan: false,
            pump: false,
            co2: false,
        }
    };
}
