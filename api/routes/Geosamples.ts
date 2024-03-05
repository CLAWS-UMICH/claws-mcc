import {Request, Response} from "express";
import Base, {RouteEvent} from "../Base";
import {Collection, Db, Document, InsertManyResult, WithId, FindCursor} from "mongodb";
import { BaseGeosample, isBaseGeosample } from "../types/Geosamples";

export interface ResponseBody {
    error: boolean,
    message: string,
    data: WithId<BaseGeosample>[]
}

export default class Geosamples extends Base {
    public routes = [
        {
            path: '/api/geosamples',
            method: 'delete',
            handler: this.deleteGeosample.bind(this),
        },
        {
            path: '/api/geosamples',
            method: 'post',
            handler: this.editGeosample.bind(this),
        }
    ];
    public events: RouteEvent[] = [
        {
            type: 'GET_SAMPLES',
            handler: this.sendSamples.bind(this),
        }
    ]

    private collection: Collection<BaseGeosample>

    constructor(db: Db, collection?: Collection<BaseGeosample>) {
        super(db);
        this.collection = collection || db.collection<BaseGeosample>('geosampling');
    }

    async sendSamples() {
        const allSamples = this.db.collection('samples').find();
        const allZones = this.db.collection('zones').find();
        const sampleData = await allSamples.toArray();
        const zoneData = await allZones.toArray();
        const messageId = 0;
        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'SAMPLES',
            use: 'POST', // TODO: what to put here
            data: {
                samples: sampleData,
                zones: zoneData
            },
        })
        this.updateARSamples(messageId, {samples: sampleData, zones: zoneData});
    }

    async deleteGeosample(req: Request, res: Response) : Promise<string> {
        const sample = req.body.data;
        if (!isBaseGeosample(sample)) {
            res.status(404).send("Invalid request");
        }

        try {
            await this.db.collection('samples').deleteOne({geosample_id: sample.geosample_id});
            const updateResult = await this.db.collection('zones').updateOne(
                {zone_id: sample.zone_id},
                {$pull: {geosample_ids: sample}}
            );

            if (updateResult.modifiedCount !== 1) {
                res.status(404).send("Error deleting sample")
            }
            // this.dispatch('FRONTEND', {
            //     id: sample.geosample_id,
            //     type: 'SAMPLES',
            //     use: 'POST',
            //     data: {

            //     }
            // })

            res.status(200).send("Deleted sample")
            return "Deleted sample";
        } catch (e) {
            res.status(404).send(e.message);
            return e.message;
        }
    }

    async editGeosample(req: Request, res: Response<ResponseBody>) : Promise<string> {
        const sample = req.body.data;
        // try {

        // }
        return "hello";
    }

    private updateARSamples(messageId: number, data: {}) : void {

    }
}