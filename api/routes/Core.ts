import {Request, Response} from "express";
import Base from "../Base";
import { Collection, Db, WithId } from "mongodb";
import Logger from "../core/logger";

const DEFAULT_ASTRONAUT_NAME = 'April';
const DEFAULT_ASTRONAUT_COLOR = '#87CEEB';

interface AstronautInitializationRequest {
    id: string;
    name: string;
    color: string;
}

export default class Core extends Base {
    public routes = [];
    public events = [
        {
            type: 'INITIAL',
            handler: this.initializeAstronaut.bind(this),
        },
        {
            type: 'KILL',
            handler: this.killAstronaut.bind(this),
        },
        {
            type: 'UPTIME',
            handler: this.dispatchUptime.bind(this),
        }
    ]

    private logger = new Logger('INITIAL');
    private collection: Collection;

    constructor(db: Db) {
        super(db);
        this.collection = db.collection('astronauts');
    }

    async initializeAstronaut(data: AstronautInitializationRequest) {
        this.logger.info(`Initializing astronaut with id: ${data?.id}, name: ${data?.name || 'N/A (defaulting to ' + DEFAULT_ASTRONAUT_NAME + ')'}, color: ${data?.color || 'N/A (defaulting to ' + DEFAULT_ASTRONAUT_COLOR + ')'}`);
        if (!data.name) {
            data.name = DEFAULT_ASTRONAUT_NAME;
        }
        if (!data.color) {
            data.color = DEFAULT_ASTRONAUT_COLOR;
        }

        const astronaut = {
            id: parseInt(data.id),
            name: data.name,
            color: data.color,
        };

        await this.collection.updateOne({ id: astronaut.id }, { $set: astronaut }, { upsert: true });

        this.logger.info(`Initialized astronaut ${astronaut.name}, dispatching waypoints and tasks`);

        const [waypoints, tasks] = await Promise.all([
            this.dispatchWaypoints(),
            this.dispatchTasks(),
        ]);

        this.logger.info(`Dispatched ${waypoints} waypoints and ${tasks} tasks to astronaut ${astronaut.name}`);
    }

    async killAstronaut(data: { id: number }) {
        this.logger.info(`Killing astronaut with id: ${data.id}`);
        const astronaut = await this.collection.findOne({ id
            : data.id });
        if (!astronaut) {
            this.logger.error(`Astronaut with id ${data.id} not found`);
            return;
        }

        // await this.collection.deleteMany({ id: data.id });
        // this.logger.info(`Killed astronaut ${astronaut.name} (and any other astronauts with the same id ${data.id})`);

        // What else do we need to do when an astronaut disconnects? Alert maybe?
    }

    async dispatchUptime() {
        const uptime = Math.floor(process.uptime());
        await this.dispatch('FRONTEND', {
            id: -1,
            type: 'UPTIME',
            use: 'PUT',
            data: uptime,
        });

        return uptime;
    }

    async dispatchWaypoints() {
        const [waypoints, currentIndex] = await Promise.all([
            this.db.collection('waypoints').find().toArray(),
            this.db.collection('waypoint_config').findOne()
            .then((doc) => {
                if (doc) return doc.current_index;
                else return 0;
            })
        ]);

        await this.dispatch('AR', {
            id: -1,
            type: 'Waypoints',
            use: 'PUT',
            data: {
                currentIndex,
                AllWaypoints: waypoints
            },
        });

        return waypoints.length;
    }

    async dispatchTasks() {
        const tasks = (await this.db.collection('tasks').find().toArray()) || [];
        await this.dispatch('AR', {
            id: -1,
            type: 'TASKLIST',
            use: 'PUT',
            data: {
                "AllTasks": tasks,
            },
        });

        return tasks.length;
    }
}