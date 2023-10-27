import redis from "./core/redis";
import db from "./core/mongo";
import { Db } from "mongodb";
import { Redis } from "ioredis";

export default class Base {
    routes: { path: string, method: string, handler: (...args: any[]) => any }[];
    db: Db;
    // redis: Redis;

    constructor() {
        this.routes = [];
        this.db = db;
        // this.redis = redis;
    }
}