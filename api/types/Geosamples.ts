import Base from '../Base';
import Message from './message';

type ARLocation = {
    latitude: number;
    longitude: number;
}

type EvaData = {
    name: string;
    id: number;
    data: {
        SiO2: number;
        TiO2: number;
        Al2O3: number;
        FeO: number;
        MnO: number;
        MgO: number;
        CaO: number;
        K2O: number;
        P2O3: number;
    }
}

export type BaseZone = {
    zone_id: string;
    geosample_ids: [number];
    location: Location;
    radius: number;
}

export type BaseGeosample = {
    geosample_id: number;
    zone_id: string;
    eva_data: EvaData;
    time: string; 
    color: string;
    shape: string;
    rock_type: string; 
    location: ARLocation;
    author: number;
    description: string;
    image: string;
}

export const isBaseGeosample = (geosample: any) : geosample is BaseGeosample => {
    return geosample.hasOwnProperty('geosample_id');
}