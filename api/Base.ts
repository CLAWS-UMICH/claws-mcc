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
    private wsVega: WebSocketServer;

    constructor(db: Db) {
        this.routes = [];
        this.db = db;
        this.redis = redis;
    }

    public setWebSocketInstances(wsFrontend: WebSocketServer, wsHoloLens: WebSocketServer, wsVega: WebSocketServer) {
        this.wsFrontend = wsFrontend;
        this.wsHoloLens = wsHoloLens;
        this.wsVega = wsVega;
    }

    public dispatch(target: 'AR' | 'FRONTEND' | 'VEGA', data: Message) {
        if (!this.wsFrontend || !this.wsHoloLens) throw new Error(`WebSocket instances not set`);
        const dispatchLogger = new Logger('DISPATCH');
        dispatchLogger.info(`Dispatching message ${data.type} to ${target}`);

        const clients = this.getTargetClients(target);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            } else {
                console.error(`WebSocket connection for client is not open`);
            }
        });
    }

    private getTargetClients(target: 'AR' | 'FRONTEND' | 'VEGA'): Set<WebSocket> {
        switch (target) {
            case 'AR':
                return this.wsHoloLens.clients;
            case 'FRONTEND':
                return this.wsFrontend.clients;
            case 'VEGA':
                return this.wsVega.clients;
            default:
                throw new Error(`Invalid target ${target}`);
        }
    }
}