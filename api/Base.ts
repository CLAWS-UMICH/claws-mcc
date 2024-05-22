import { Db } from "mongodb";
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

export interface TSSEvent {
    path: string,
    handler: (...args: any[]) => any
}

// Types of messages to ignore when logging (typically for high-frequency messages)
export const IGNORED_TYPES = ['UPTIME'];

export default class Base {
    public readonly routes: Route[];
    public readonly events: RouteEvent[];
    public readonly tssFiles: TSSEvent[]
    public db: Db;
    private wsFrontend: WebSocketServer;
    private wsHoloLens: WebSocketServer;
    private wsVega: WebSocketServer;

    constructor(db: Db) {
        this.routes = [];
        this.db = db;
    }

    public setWebSocketInstances(wsFrontend: WebSocketServer, wsHoloLens: WebSocketServer, wsVega: WebSocketServer) {
        this.wsFrontend = wsFrontend;
        this.wsHoloLens = wsHoloLens;
        this.wsVega = wsVega;
    }

    public async dispatch(target: 'AR' | 'FRONTEND' | 'VEGA', data: Message) {
        if (!this.wsFrontend || !this.wsHoloLens) throw new Error(`WebSocket instances not set`);
        const dispatchLogger = new Logger('DISPATCH');
        dispatchLogger.info(`Dispatching message ${data.type} to ${target} with data`);

        if (target == 'AR') {
            data.type = data.type.toUpperCase();
        }

        const clients = this.getTargetClients(target);
        if (!clients.size) {
            return setTimeout(() => {
                this.dispatch(target, data);
            }, 2000);
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

        if (!IGNORED_TYPES.includes(data.type)) {
            dispatchLogger.info(`Dispatched message ${data.type} to ${target}`);
        }
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