import {Request, Response} from "express";
import Base from "../Base";
import {VitalsMessage} from "../types/Astronaut";
import {Collection, Db, Document, InsertManyResult, WithId, FindCursor} from "mongodb";

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
        {
            type: 'VITALS',
            handler: this.handleVitalsMessage.bind(this),
        }
    ]

    private collection: Collection<Astronaut>

    constructor(db: Db) {
        super(db);
        this.collection = db.collection('astronauts');
    }

    async fetchAstronaut(idOrName: string): Promise<WithId<Astronaut>> {
        const id = parseInt(idOrName);
        // if id is NaN, it's not a number, so it's a name
        if (isNaN(id)) {
            const result = this.collection.find({name: idOrName});
            const resultArray = await result.toArray();
            if (resultArray.length > 1) throw new Error('More than one astronaut found, please specify id');
            if (resultArray.length === 0) throw new Error('Astronaut not found');
            return resultArray[0];
        }
        const result: WithId<Astronaut> | null = await this.collection.findOne({id: id});
        if (!result) throw new Error('Astronaut not found');
        return result;
    }

    async getAstronaut(req: Request, res: Response) {
        // key is either astronaut name or id
        const key = req.params.astronaut;
        try {
            const astronaut: Astronaut = await this.fetchAstronaut(key);
            res.status(200).send(astronaut);
            return astronaut;
        } catch (e) {
            res.status(404).send(e.message);
            return e.message;
        }
    }

    async deleteAstronaut(req: Request, res: Response): Promise<string> {
        // key is either astronaut name or id
        const key = req.params.astronaut;
        try {
            const astronaut: Astronaut = await this.fetchAstronaut(key);
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