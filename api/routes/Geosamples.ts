import {Request, Response} from "express";
import Base, {RouteEvent} from "../Base";
import {Collection, Db, Document, InsertManyResult, WithId, FindCursor} from "mongodb";
import { BaseGeosample } from "../types/Geosamples";

export default class Geosamples extends Base {
    public routes = [
        {
            path: '/api/geosamples',
            method: 'put',
            handler: this.addGeosample.bind(this),
        },
        {
            path: '/api/geosamples',
            method: 'delete',
            handler: this.deleteGeosample.bind(this),
        },
        {
            path: '/api/geosamples',
            method: ''
        }
    ];

    private collection: Collection<BaseGeosample>

    constructor(db: Db) {
        super(db);
        this.collection = db.collection<BaseGeosample>('geosamples');
    }


    async addGeosample(req: Request, res: Response) : Promise<string> {
        return "hello";
    }

    async deleteGeosample(req: Request, res: Response) : Promise<string> {
        return "hello";
    }
}