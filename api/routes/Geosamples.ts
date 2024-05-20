import {Request, Response} from "express";
import Base, {RouteEvent} from "../Base";
import {Collection, Db,  WithId} from "mongodb";
import { BaseGeosample, BaseZone, SampleMessage, isGeosample, isZone } from "../types/Geosamples";
import Logger from "../core/logger";

export interface ResponseBody {
    error: boolean,
    message: string,
    data: WithId<BaseGeosample>[]
}

export default class Geosamples extends Base {
    public routes = [
        {
            path: '/api/geosamples/deleteGeosample',
            method: 'delete',
            handler: this.deleteGeosample.bind(this),
        },
        {
            path: '/api/geosamples/editGeosample',
            method: 'put',
            handler: this.editGeosample.bind(this),
        }
    ];
    public events: RouteEvent[] = [
        {
            type: 'GET_SAMPLES', // to handle incoming messages from frontend
            handler: this.sendSamples.bind(this),
        },
        {
            type: 'GEOSAMPLES', // to handle incoming messages from hololens
            handler: this.addGeosamples.bind(this)
        }
    ];

    private static messageId: number = 0;
    private static sampleIds: { [zone_id : string] : number } = {};
    private samplesCollection: Collection<BaseGeosample>;
    private zonesCollection: Collection<BaseZone>;
    private logger = new Logger('Geosampling');

    constructor(db: Db, sampleCollection?: Collection<BaseGeosample>, zoneCollection?: Collection<BaseZone>) {
        super(db);
        this.samplesCollection = sampleCollection || db.collection<BaseGeosample>('samples');
        this.zonesCollection = zoneCollection || db.collection<BaseZone>('zones');
    };

    private static incrementMessageId(): number {
        return this.messageId++;
    }

    private static incrementSampleId(sample: BaseGeosample): number {
        if (!this.sampleIds || !this.sampleIds.hasOwnProperty(sample.zone_id)) {
            this.sampleIds[sample.zone_id] = 1;
        }
        return this.sampleIds[sample.zone_id]++;
    }
        
    private static resetSampleIds(sample: BaseGeosample): number {
        if (!this.sampleIds.hasOwnProperty(sample.zone_id)) {
            this.sampleIds[sample.zone_id] = 1;
        }
        return this.sampleIds[sample.zone_id]++;
    }

    async sendSamples() {
        this.logger.info("GEOSAMPLES: sending samples to frontend");

        // Retrieve all samples and zones from database
        const allSamples = this.samplesCollection.find();
        const allZones = this.zonesCollection.find();
        const sampleData = await allSamples.toArray();
        const zoneData = await allZones.toArray();
        const messageId = Geosamples.incrementMessageId();
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

    async addGeosamples(message: SampleMessage) : Promise<{}> {
        this.logger.info("Received samples from Hololens, sending samples to frontend");
        const samples = message.data.AllGeosamples;
        const zones = message.zones.AllGeosampleZones;
        this.logger.info(JSON.stringify(message.data))
        this.logger.info(JSON.stringify(message.zones))
        this.logger.info(zones.length);


        if (!zones || !samples) {
            this.logger.error("No samples/zones received");
            return "Error";
        }
        if (zones.length > 0) {
            for (let i = 0; i < zones.length; i++) {
                if (!zones[i] || !isZone(zones[i])) {
                    this.logger.error("Geosample zones in incorrect format.");
                    return "Error";
                }
                Geosamples.sampleIds[zones[i].zone_id] = 1;
            }
            for (let i = 0; i < samples.length; i++) {
                if (!isGeosample(samples[i])) {
                    this.logger.error("Geosample in incorrect format.");
                    return "Error";
                }
                samples[i].id = Geosamples.incrementSampleId(samples[i]);
            }
        }

        try {
            await this.samplesCollection.deleteMany({});
            await this.samplesCollection.insertMany(samples);
            this.logger.info("samples got hereeee")
            await this.zonesCollection.deleteMany({});
            await this.zonesCollection.insertMany(zones);
            this.logger.info("zones got hereeee")
            const allSamples = this.samplesCollection.find();
            const allZones = this.zonesCollection.find();
            const sampleData = await allSamples.toArray();
            const zoneData = await allZones.toArray();
            this.logger.info("this the problem?")
            this.dispatch('FRONTEND', {
                id: -1,
                type: 'SEND_SAMPLES',
                use: 'PUT',
                data: { samples: sampleData, zones: zoneData }
            });
            this.logger.info({ samples: samples, zones: zones });
            // this.updateARSamples(Geosamples.incrementMessageId(), { samples: samples, zones: zones });
            return "Received geosamples";
        } catch (e) {
            this.logger.error(e.message);
            return e.message;
        }
    }

    async deleteGeosample(req: Request, res: Response): Promise<{}> {
        const sample = req.body.data;
        if (!isGeosample(sample)) {
            res.status(400).send("Invalid request");
        }

        try {
            if (sample.hasOwnProperty("_id")) {
                delete sample._id;
            }
            await this.samplesCollection.deleteOne({geosample_id: sample.geosample_id, zone_id: sample.zone_id});
            const updateResult = await this.zonesCollection.updateOne(
                { zone_id: sample.zone_id },
                { $pull: { geosample_ids: sample.geosample_id } }
            );

            if (updateResult.modifiedCount !== 1) {
                res.status(400).send("Error deleting sample")
            }
            const allSamples = this.samplesCollection.find();
            const allZones = this.zonesCollection.find();
            const sampleData = await allSamples.toArray();
            const zoneData = await allZones.toArray();
            res.status(200).send({samples: sampleData, zones: zoneData})
            this.updateARSamples(Geosamples.incrementMessageId(), {samples: sampleData, zones: zoneData});
            return "Deleted sample";
        } catch (e) {
            res.status(400).send(e.message);
            return e.message;
        }
    }

    async editGeosample(req: Request, res: Response) : Promise<string> {
        const sample = req.body.data;
        try {
            if (sample.hasOwnProperty("_id")) {
                delete sample._id;
            }
            const replaceResult = await this.samplesCollection.replaceOne({geosample_id: sample.geosample_id, zone_id: sample.zone_id}, sample, {upsert: true});
            if (replaceResult.modifiedCount !== 1) {
                res.status(400).send("Error updating sample")
            }
            const sampleData = await this.samplesCollection.find().toArray();
            const zoneData = await this.zonesCollection.find().toArray();
            this.updateARSamples(Geosamples.incrementMessageId(), {samples: sampleData, zones: zoneData});
            res.status(200).send({samples: sampleData, zones: zoneData});
            return "Edited sample";
        } catch (e) {
            this.logger.info(e.message)
            res.status(400).send(e.message);
            return e.message;
        }
    }

    private updateARSamples(messageId: number, data: {samples: BaseGeosample[], zones: BaseZone[]}) : void {
        const newGeosampleMessage: SampleMessage = {
            id: messageId,
            type: 'GEOSAMPLES',
            use: 'PUT',
            data: {AllGeosamples: data.samples},
            zones: {AllGeosampleZones: data.zones},
        }
        this.dispatch("AR", newGeosampleMessage);
    }
}