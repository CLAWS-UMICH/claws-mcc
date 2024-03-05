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
    geosample_ids: [BaseGeosample];
    location: Location;
    radius: number;
}

export type BaseGeosample = {
    geosample_id: number;
    zone_id: string;
    starred: boolean;
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
    if (typeof geosample !== 'object') return false;
    if (!geosample.hasOwnProperty('geosample_id')) return false;
    if (!geosample.hasOwnProperty('zone_id')) return false;
    if (!geosample.hasOwnProperty('starred')) return false;
    if (!geosample.hasOwnProperty('eva_data')) return false;
    if (!geosample.hasOwnProperty('time')) return false;
    if (!geosample.hasOwnProperty('color')) return false;
    if (!geosample.hasOwnProperty('shape')) return false;
    if (!geosample.hasOwnProperty('rock_type')) return false;
    if (!geosample.hasOwnProperty('location')) return false;
    if (!geosample.hasOwnProperty('author')) return false;
    if (!geosample.hasOwnProperty('description')) return false;
    return geosample.hasOwnProperty('image');
}

export const isBaseZone = (zone: any) : zone is BaseZone => {
    if (typeof zone !== 'object') return false;
    if (!zone.hasOwnProperty('zone_id')) return false;
    if (!zone.hasOwnProperty('geosample_ids')) return false;
    if (!zone.hasOwnProperty('location')) return false;
    return zone.hasOwnProperty('radius');
}

// export const isMessage = (message: any): boolean => {
//     if (typeof message !== 'object') return false;
//     if (!message.hasOwnProperty('id')) return false;
//     if (!message.hasOwnProperty('type')) return false;
//     return message.hasOwnProperty('use');
// }

export interface SampleMessage extends Message {
    id: number;
    type: string;
    data: {
        AllSamples: BaseGeosample[];
        AllZones: BaseZone[];
    };
}

export const SampleRequestMessage = (id: number) : Message => (
    {    
        id: id,
        type: 'Samples',
        use: 'GET',
    }
)

export const ZoneRequestMessage = (id: number) : Message => (
    {    
        id: id,
        type: 'Zones',
        use: 'GET',
    }
)

export const isSampleMessage = (message: Message) : boolean => {
    if (typeof message !== 'object') return false;
    if (!message.hasOwnProperty('id')) return false;
    if (!message.hasOwnProperty('type')) return false;
    return message.hasOwnProperty('data');
}