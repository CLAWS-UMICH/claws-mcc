type ARLocation = {
    latitude: number;
    longitude: number;
};

export type EvaData = {
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
};

export type BaseGeosample = {
    _id?: number;
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
    photo_jpg: string;
};

export type BaseZone = {
    _id?: number;
    zone_id: string;
    ZoneGeosamplesIds: number[];
    location: ARLocation;
    radius: number;
};

export type ManagerState = {
    sample_zones: BaseZone[];
    geosamples: BaseGeosample[];
    selected?: BaseGeosample;
};

export type ManagerAction =
    { type: 'set', payload: {zones: BaseZone[], samples: BaseGeosample[]} } | // Should only be used by ServerListener
    { type: 'delete', payload: BaseGeosample } |
    { type: 'update', payload: BaseGeosample } |
    { type: 'select', payload: BaseGeosample } |
    { type: 'deselect' };