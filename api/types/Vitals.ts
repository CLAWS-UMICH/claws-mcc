export type TSSEvaData = {
    batt_time_left: number;
    oxy_pri_storage: number;
    oxy_sec_storage: number;
    oxy_pri_pressure: number;
    oxy_sec_pressure: number;
    oxy_time_left: number;
    heart_rate: number;
    oxy_consumption: number;
    co2_production: number;
    suit_pressure_oxy: number;
    suit_pressure_co2: number;
    suit_pressure_other: number;
    suit_pressure_total: number;
    fan_pri_rpm: number;
    fan_sec_rpm: number;
    helmet_pressure_co2: number;
    scrubber_a_co2_storage: number;
    scrubber_b_co2_storage: number;
    temperature: number;
    coolant_ml: number;
    coolant_gas_pressure: number;
    coolant_liquid_pressure: number;
}

export type DCUValues = {
    batt: boolean,
    oxy: boolean,
    comm: boolean,
    fan: boolean,
    pump: boolean,
    co2: boolean, 
}

export type VitalsData = {
    id: number,
    eva_time: number;
    tss_data: TSSEvaData;
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