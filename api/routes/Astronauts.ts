import {Request, Response} from "express";
import Base from "../Base";
import {VitalsMessage} from "../types/Astronaut";
import {Collection, Db, Document, InsertManyResult, WithId, FindCursor} from "mongodb";
import Logger from "../core/logger";

interface Astronaut {
    id: number,
    name: string
}

export default class Astronauts extends Base {
    public routes = [
        {
            path: '/api/astronaut/:astronaut',
            method: 'get',
            handler: this.getAstronaut.bind(this),
        },
        {
            path: '/api/astronaut/:astronaut',
            method: 'post',
            handler: this.updateAstronaut.bind(this),
        },
        {
            path: '/api/astronaut/:astronaut',
            method: 'delete',
            handler: this.deleteAstronaut.bind(this),
        }
    ];
    public events = [
        // {
        //     type: 'VITALS',
        //     handler: this.handleVitalsMessage.bind(this),
        // },
        {
            type: 'GET_ASTRONAUT',
            handler: this.fetchAstronaut.bind(this),
        },
        {
            type: 'GET_ASTRONAUTS',
            handler: this.fetchAstronauts.bind(this),
        }
    ]

    private logger = new Logger('Astronauts');
    private collection: Collection<Astronaut>

    constructor(db: Db) {
        super(db);
        this.collection = db.collection('astronauts');
    }

    async fetchAstronaut(data: { id?: number, name?: string }): Promise<Astronaut> {
        if (data.name) {
            const result = this.collection.find({ name: data.name });
            const resultArray = await result.toArray();
            if (resultArray.length > 1) return this.logger.error('More than one astronaut found, please specify id');
            if (resultArray.length === 0) return this.logger.error('Astronaut not found');

            this.dispatch('FRONTEND', {
                id: resultArray[0].id,
                type: 'ASTRONAUT',
                use: 'GET',
                data: resultArray[0],
            });

            return resultArray[0];
        } else {
            const result: WithId<Astronaut> | null = await this.collection.findOne({ id: data.id });
            if (!result) return this.logger.error('Astronaut not found');
    
            this.dispatch('FRONTEND', {
                id: result.id,
                type: 'ASTRONAUT',
                use: 'GET',
                data: result,
            });

            return result;
        }
    }

    async fetchAstronauts({ lmcc }): Promise<Astronaut[]> {
        let result: FindCursor<Astronaut>;
        if (lmcc) {
            result = this.collection.find({ });
        } else {
            result = this.collection.find({ id: { $gte: 0 } });
        }
        const resultArray = await result.toArray();
        if (resultArray.length === 0) return this.logger.error('No astronauts found');

        this.dispatch('FRONTEND', {
            id: -1,
            type: 'ASTRONAUTS',
            use: 'GET',
            data: resultArray,
        });

        return resultArray;
    }

    async getAstronaut(req: Request, res: Response) {
        // key is either astronaut name or id
        const key = req.params.astronaut as unknown as number;
        try {
            const astronaut: Astronaut = await this.fetchAstronaut({ id: key });
            res.status(200).send(astronaut);
            return astronaut;
        } catch (e) {
            res.status(404).send(e.message);
            return e.message;
        }
    }

    async deleteAstronaut(req: Request, res: Response): Promise<string> {
        // key is either astronaut name or id
        const key = req.params.astronaut as unknown as number;
        try {
            const astronaut: Astronaut = await this.fetchAstronaut({ id: key });
            await this.collection.deleteOne({id: astronaut.id});
            const status = 200;
            const msg = 'Deleted astronaut';
            res.status(status).send(msg);
            return msg;
        } catch (e) {
            res.status(404).send(e.message);
            return e.message;
        }
    }

    async updateAstronaut(req: Request, res: Response): Promise<string> {
        const astronaut = req.body;
        try {
            const currentAstronaut: Astronaut = await this.fetchAstronaut(astronaut.id);
            await this.collection.replaceOne({id: astronaut.id}, astronaut);
            const msg = 'Updated astronaut';
            res.status(200).send(msg);
            return msg;
        } catch (e) {
            if (e.message === 'Astronaut not found') {
                await this.collection.insertOne(astronaut);
                const msg = 'Created astronaut';
                res.status(201).send(msg);
                return msg;
            }
            res.status(404).send(e.message);
            return e.message;
        }
    }

    async handleVitalsMessage(data: VitalsMessage) {
        // update db if necessary (id is astronaut id, upsert means insert if not found)
        await this.db.collection('vitals').updateOne({id: data.id}, {$set: data.data}, {upsert: true});

        // .. do what else we want to do with the data

        this.dispatch('FRONTEND', {
            id: data.id,
            type: 'VITALS',
            use: 'PUT',
            data: data.data,
        });
    }
}