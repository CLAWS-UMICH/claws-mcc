import Redis from 'ioredis';
import Logger from './logger';

const redis = new Redis({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_URI,
    port: 19005
});

const logger = new Logger('Redis');

redis.on("connect", function() {
    logger.info('Connected to Redis');
});

redis.on("error", function(error) {
    logger.error(`Redis error: ${error}`);
});

export default redis;
