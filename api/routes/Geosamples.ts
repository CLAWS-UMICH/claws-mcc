import { Request, Response } from "express";
import Base, { RouteEvent } from "../Base";
import { Collection, Db, WithId } from "mongodb";
import { BaseGeosample, BaseZone, SampleMessage, isBaseGeosample, isBaseZone } from "../types/Geosamples";
import Logger from "../core/logger";

export interface ResponseBody {
    error: boolean,
    message: string,
    data: WithId<BaseGeosample>[]
}

export default class Geosamples extends Base {
    public routes = [
        {
            path: '/api/geosamples', // to handle incoming messages from hololens
            method: 'post',
            handler: this.addGeosamples.bind(this),
        },
        {
            path: '/api/geosamples',
            method: 'delete',
            handler: this.deleteGeosample.bind(this),
        },
        {
            path: '/api/geosamples',
            method: 'put',
            handler: this.editGeosample.bind(this),
        }
    ];
    public events: RouteEvent[] = [
        {
            type: 'GET_SAMPLES', // to handle incoming messages from frontend
            handler: this.sendSamples.bind(this),
        },
        // {
        //     type: 'SEND_SAMPLES', 
        //     handler: this.
        // },
    ];

    private samplesCollection: Collection<BaseGeosample>;
    private zonesCollection: Collection<BaseZone>;
    private logger = new Logger('Geosampling');

    constructor(db: Db, sampleCollection?: Collection<BaseGeosample>, zoneCollection?: Collection<BaseZone>) {
        super(db);
        this.samplesCollection = sampleCollection || db.collection<BaseGeosample>('samples');
        this.zonesCollection = zoneCollection || db.collection<BaseZone>('zones');
    };

    async sendSamples() {
        this.logger.info("Sending samples");
        const allSamples = this.samplesCollection.find();
        const allZones = this.zonesCollection.find();
        const sampleData = await allSamples.toArray();
        const zoneData = await allZones.toArray();
        const messageId = 0;
        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'SEND_SAMPLES',
            use: 'PUT',
            data: {
                samples: sampleData,
                zones: zoneData
            },
        });
        this.updateARSamples(messageId, { samples: sampleData, zones: zoneData });
    }

    async addGeosamples(req: Request, res: Response): Promise<{}> {
        const data = req.body.data;
        try {
            var operations = data['samples'].map((sample: BaseGeosample) => ({
                replaceOne: {
                    filter: { geosample_id: sample.geosample_id },
                    replacement: sample,
                    upsert: true
                }
            }));
            var result = await this.samplesCollection.bulkWrite(operations);
            const samplesCursor = this.samplesCollection.find();
            const samplesArray = await samplesCursor.toArray();
            const sampleMap = new Map(samplesArray.map(sample => [sample.geosample_id, sample]));
            const modZones = data['zones'].map((zone: any) => ({
                ...zone,
                geosample_ids: zone.geosample_ids.map((id: number) => sampleMap.get(id) || null)  // Replace id with sample object
            }));
            operations = modZones.map((zone: BaseZone) => ({
                replaceOne: {
                    filter: { zone_id: zone.zone_id },
                    replacement: zone,
                    upsert: true
                }
            }));
            result = await this.zonesCollection.bulkWrite(operations);
            this.dispatch('FRONTEND', {
                id: -1,
                type: 'SEND_SAMPLES',
                use: 'PUT',
                data: { samples: samplesArray, zones: modZones }
            });
            res.status(200).send({ samples: samplesArray, zones: modZones });
            this.updateARSamples(0, { samples: samplesArray, zones: modZones });
            return { samples: samplesArray, zones: modZones };
        } catch (e) {
            res.status(404).send(e.message);
            return e.message;
        }
    }

    async deleteGeosample(req: Request, res: Response): Promise<{}> {
        const sample = req.body.data;
        if (!isBaseGeosample(sample)) {
            res.status(404).send("Invalid request");
        }

        try {
            await this.samplesCollection.deleteOne({ geosample_id: sample.geosample_id });
            const updateResult = await this.zonesCollection.updateOne(
                { zone_id: sample.zone_id },
                { $pull: { geosample_ids: sample } }
            );

            if (updateResult.modifiedCount !== 1) {
                res.status(404).send("Error deleting sample")
            }
            res.status(200).send("Deleted sample")
            const allSamples = this.samplesCollection.find();
            const allZones = this.zonesCollection.find();
            const sampleData = await allSamples.toArray();
            const zoneData = await allZones.toArray();
            this.updateARSamples(0, { samples: sampleData, zones: zoneData });
            return "Deleted sample";
        } catch (e) {
            res.status(404).send(e.message);
            return e.message;
        }
    }

    async editGeosample(req: Request, res: Response): Promise<string> {
        const data = req.body.data;
        const sample = req.body.data;
        try {
            const allSamples = this.samplesCollection.replaceOne({ geosample_id: sample.geosample_id }, sample, { upsert: true });
            const sampleData = await this.samplesCollection.find().toArray();
            const zoneData = await this.zonesCollection.find().toArray();
            this.updateARSamples(0, { samples: sampleData, zones: zoneData });
            res.status(200).send("Edited sample");
            return "Edited sample";
        } catch (e) {
            res.status(404).send(e.message);
            return e.message;
        }
    }

    private updateARSamples(messageId: number, data: { samples: BaseGeosample[], zones: BaseZone[] }): void {
        const newGeosampleMessage: SampleMessage = {
            id: messageId,
            type: 'Geosamples',
            use: 'PUT',
            data: {
                AllGeosamples: data.samples,
                AllGeosamplezones: data.zones,
            }
        }
        this.dispatch("AR", newGeosampleMessage);
    }
}