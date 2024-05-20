export type TSSEvaData = {
    // TODO: MATCH TSS VALUES
    battery_time_left: number;
    primary_oxygen_storage: number;
    secondary_oxygen_storage: number;
    primary_oxygen_pressure: number,
    secondary_oxygen_pressure: number,
    oxygen_time_left: number,
    heart_rate: number,
    oxygen_consumption: number,
    co2_production: number,
    suit_oxygen_pressure: number,
    suit_cO2_pressure: number,
    suit_other_pressure: number,
    suit_total_pressure: number,
    primary_fan_rpm: number,
    secondary_fan_rpm: number,
    helmet_co2_pressure: number,
    scrubber_a_co2_capacity: number,
    scrubber_b_co2_capacity: number,
    temperature: number,
    coolant_ml: number,
    h2o_gas_pressure: number,
    h2o_liquid_pressure: number,
    alerts: Alert[]
}

export type DCUValues = {
    eva1: {
        batt: boolean,
        oxy: boolean,
        comm: boolean,
        fan: boolean,
        pump: boolean,
        co2: boolean, 
    },
    eva2: {
        batt: boolean,
        oxy: boolean,
        comm: boolean,
        fan: boolean,
        pump: boolean,
        co2: boolean,
    }
}

export type VitalsData = {
    id: number,
    eva_time: number;
    eva_1: TSSEvaData;
    eva_2: TSSEvaData;
    dcu: DCUValues;
}

interface Alert {
    code: string;
    message: string;
}

export type ManagerState = {
    vitals: VitalsData;
    alerts?: Alert
}

export type ManagerAction = { type: 'set', payload: VitalsData }