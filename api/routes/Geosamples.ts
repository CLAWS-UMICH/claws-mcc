import {Request, Response} from "express";
import Base, {RouteEvent} from "../Base";
import {Collection, Db,  WithId} from "mongodb";
import { BaseGeosample, BaseZone, EvaData, SampleMessage, isGeosample, isZone } from "../types/Geosamples";
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
        return -1;
        // return this.messageId++;
    }

    // private static incrementSampleId(sample: BaseGeosample): number {
    //     if (!this.sampleIds || !this.sampleIds.hasOwnProperty(sample.zone_id)) {
    //         this.sampleIds[sample.zone_id] = 1;
    //     }
    //     return this.sampleIds[sample.zone_id]++;
    // }

    async sendSamples(payload: any) {
        const { platform = 'AR' } = payload;

        this.logger.info("GEOSAMPLES: sending samples to frontend");

        // Retrieve all samples and zones from database
        const allSamples = this.samplesCollection.find();
        const allZones = this.zonesCollection.find();
        const sampleData = await allSamples.toArray();
        const zoneData = await allZones.toArray();
        const messageId = Geosamples.incrementMessageId();
        if (platform == 'FRONTEND') {
            this.dispatch('FRONTEND', {
                id: messageId,
                type: 'SEND_SAMPLES',
                use: 'PUT',
                data: {
                    samples: sampleData,
                    zones: zoneData
                },
            });
        }
        this.updateARSamples(messageId, { samples: sampleData, zones: zoneData }, platform);
    }

    async addGeosamples(message: SampleMessage) : Promise<{}> {
        this.logger.info("Received samples from Hololens, sending samples to frontend");
        const samples = message.data.AllGeosamples;
        const zones = message.zones.AllGeosampleZones;

        this.logger.info("orig samples", samples);
        this.logger.info("orig zones", zones);

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
                // Geosamples.sampleIds[zones[i].zone_id] = 1;
            }
            for (let i = 0; i < samples.length; i++) {
                if (!isGeosample(samples[i])) {
                    this.logger.error("Geosample in incorrect format.");
                    return "Error";
                }

                if (!samples[i].starred) {
                    samples[i].starred = this.determineSignificance(samples[i].eva_data);
                    this.logger.info(samples[i].starred)
                    this.updateARSamples(-1, { samples: samples, zones: zones });
                }
                if (!samples[i].eva_data.name || samples[i].eva_data.name === "") {
                    samples[i].eva_data.name = "Geo Sample " + samples[i].geosample_id.toString();
                }
                if (!samples[i].rock_type || samples[i].rock_type === "") {
                    samples[i].rock_type = "Unknown";
                }
                // samples[i].id = Geosamples.incrementSampleId(samples[i]);
            }
        }

        this.logger.info("samples", samples);
        this.logger.info("zones", zones);

        try {
            if (samples) {
                await this.samplesCollection.deleteMany({});
                await this.samplesCollection.insertMany(samples);
            }
            if (zones) {
                await this.zonesCollection.deleteMany({});
                await this.zonesCollection.insertMany(zones);
            }
            this.logger.info("or here  no ?")
            const allSamples = this.samplesCollection.find();
            const allZones = this.zonesCollection.find();
            const sampleData = await allSamples.toArray();
            const zoneData = await allZones.toArray();
            this.dispatch('FRONTEND', {
                id: -1,
                type: 'SEND_SAMPLES',
                use: 'PUT',
                data: { samples: sampleData, zones: zoneData }
            });
            this.logger.info({ samples: samples, zones: zones });
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
        this.logger.info(sample);
        try {
            if (sample.hasOwnProperty("_id")) {
                delete sample._id;
            }
            const replaceResult = await this.samplesCollection.replaceOne({geosample_id: sample.geosample_id, zone_id: sample.zone_id}, sample, {upsert: false});
            if (replaceResult.modifiedCount !== 1) {
                res.status(400).send("Error updating sample")
            }
            const sampleData = await this.samplesCollection.find().toArray();
            const zoneData = await this.zonesCollection.find().toArray();
            this.updateARSamples(Geosamples.incrementMessageId(), {samples: sampleData, zones: zoneData});
            res.status(200).send({samples: sampleData, zones: zoneData});
            return "Edited sample";
        } catch (e) {
            this.logger.error(e.message)
            res.status(400).send(e.message);
            return e.message;
        }
    }

    private updateARSamples(messageId: number, data: {samples: BaseGeosample[], zones: BaseZone[]}, platform?: string) : void {
        const newGeosampleMessage: SampleMessage = {
            id: messageId,
            type: 'GEOSAMPLES',
            use: 'PUT',
            data: {AllGeosamples: data.samples},
            zones: {AllGeosampleZones: data.zones},
        }

        if (!platform || platform === 'AR') {
            this.dispatch("AR", newGeosampleMessage);
        }
    }

    private determineSignificance(eva_data: EvaData): boolean{
        this.logger.info(eva_data)
        const total = eva_data.data.SiO2 + eva_data.data.TiO2 + eva_data.data.Al2O3 + eva_data.data.FeO + eva_data.data.MnO + eva_data.data.MgO + eva_data.data.CaO + eva_data.data.K2O + eva_data.data.P2O3;
        if (eva_data.data.SiO2 > 0 && eva_data.data.SiO2 < 10) return true;
        if (eva_data.data.TiO2 > 1) return true;
        if (eva_data.data.Al2O3 > 10) return true;
        if (eva_data.data.FeO > 29) return true;
        if (eva_data.data.MnO > 1) return true;
        if (eva_data.data.MgO > 20) return true;
        if (eva_data.data.CaO > 10) return true;
        if (eva_data.data.K2O > 1) return true;
        if (eva_data.data.P2O3 > 1.5) return true;
        if (1-total > 50) return true;
        return false;
    }
}