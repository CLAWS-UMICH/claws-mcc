import { Request, Response } from "express";
import Base, { RouteEvent } from "../Base";
import { Collection, Db, Document, InsertManyResult, WithId } from "mongodb";
import Logger from "../core/logger";


export default class Rover extends Base {
    public tssFiles = [
        {
            path: '/ROVER.json',
            handler: this.handleTSSRoverUpdate.bind(this),
        }
    ]
    private logger = new Logger('Rover');

    async handleTSSRoverUpdate(data: any) {
        this.logger.info('Handling TSS Rover Update');
        const messageId = -1;
        this.dispatch('FRONTEND', {
            id: messageId,
            type: 'ROVER',
            use: 'GET',
            data: data,
        })
    }
}