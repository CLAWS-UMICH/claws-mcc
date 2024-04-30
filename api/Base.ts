import redis from "./core/redis";
import { Db } from "mongodb";
import { Redis } from "ioredis";
import { WebSocket, WebSocketServer } from "ws";
import Message from "./types/message";
import Logger from "./core/logger";

export interface RouteEvent {
    type: string,
    handler: (...args: any[]) => any
}

export interface Route {
    path: string,
    method: string,
    handler: (...args: any[]) => any
}


export default class Base {
    public readonly routes: Route[];
    public readonly events: RouteEvent[];
    public db: Db;
    public redis: Redis;
    private wsFrontend: WebSocketServer;
    private wsHoloLens: WebSocketServer;

    constructor(db: Db) {
        this.routes = [];
        this.db = db;
        this.redis = redis;
    }

    public setWebSocketInstances(wsFrontend: WebSocketServer, wsHoloLens: WebSocketServer) {
        this.wsFrontend = wsFrontend;
        this.wsHoloLens = wsHoloLens;
    }

    public async dispatch(target: 'AR' | 'FRONTEND', data: Message): Promise<void> {
        if (!this.wsFrontend || !this.wsHoloLens) throw new Error(`WebSocket instances not set`);
        const dispatchLogger = new Logger('DISPATCH');
        dispatchLogger.info(`Dispatching message ${data.type} to ${target}`);

        const clients = (target === 'AR') ? this.wsHoloLens.clients : this.wsFrontend.clients;

        if (target == 'AR') {
            data.type = data.type.toUpperCase();
        }

        await Promise.all([...clients].map(async (client) => {
            if (client.readyState === WebSocket.OPEN) {
                await new Promise((resolve, reject) => {
                    client.send(JSON.stringify(data), (error) => {
                        if (error) reject(error);
                        else resolve(true);
                    });
                });
            } else {
                console.error(`WebSocket connection for client is not open`);
            }
        }));
    }
}