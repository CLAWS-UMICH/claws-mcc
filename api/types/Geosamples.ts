import Base from '../Base';
import Message from './message';

//TODO: should we have this type declaration in just one file
type ARLocation = {
    latitude: number;
    longitude: number;
}

export type BaseGeosample = {
    geosample_id: number;
    type: string; //arbitrary value
    description: string;
    spec_data: number; //arbitrary value
    location: ARLocation;
    date: number; //arbitrary value
    time: number; //arbitrary value
    images: string; //arbitrary value
    author: number; //don't know if we need this, probably will though
}

export const isBaseGeosample = (geosample: any) : geosample is BaseGeosample => {
    return geosample.hasOwnProperty('geosample_id');
}