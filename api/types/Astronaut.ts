import Message from './message';

export interface VitalsMessage extends Message {
    use: 'PUT';
    data: {
        room_id: number;
        is_running: boolean;
        is_paused: boolean;
        time: number;
        timer: string;
        started_at: string;
        primary_oxygen: number;
        secondary_oxygen: number;
        suit_pressure: number;
        sub_pressure: number;
        o2_pressure: number;
        o2_rate: number;
        h2o_gas_pressure: number;
        h2o_liquid_pressure: number;
        sop_pressure: number;
        sop_rate: number;
        heart_rate: number;
        fan_tachometer: number;
        battery_capacity: number;
        temperature: number;
        battery_time_left: string;
        o2_time_left: string;
        h2o_time_left: string;
        battery_percentage: number;
        battery_outputput: number;
        oxygen_primary_time: number;
        oxygen_secondary_time: number;
        water_capacity: number;
        dcu?: {
            batt: boolean,
            oxy: boolean,
            comm: boolean,
            fan: boolean,
            pump: boolean,
            co2: boolean
        }
    };
}