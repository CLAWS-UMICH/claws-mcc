import redis from "./core/redis";
import db from "./core/mongo";
import {Db} from "mongodb";
import {Redis} from "ioredis";
import {WebSocket, WebSocketServer} from "ws";

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

    constructor() {
        this.routes = [];
        this.db = db;
        this.redis = redis;
    }

    public setWebSocketInstances(wsFrontend: WebSocketServer, wsHoloLens: WebSocketServer) {
        this.wsFrontend = wsFrontend;
        this.wsHoloLens = wsHoloLens;
    }

    public dispatch(target: 'AR' | 'FRONTEND', data: {
        id?: number,
        astronaut?: number,
        requestType?: 'PUT' | 'DELETE' | 'GET' | 'POST',
        type: string,
        data: any
    }) {
        if (!this.wsFrontend || !this.wsHoloLens) throw new Error(`WebSocket instances not set`);

        const clients = (target === 'AR') ? this.wsHoloLens.clients : this.wsFrontend.clients;

        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            } else {
                console.error(`WebSocket connection for client is not open`);
            }
        });
    }
}