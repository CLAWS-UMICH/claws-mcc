import Redis from 'ioredis';

const redis = new Redis({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_URI,
    port: 19005
});

redis.on("connect", function() {
    console.log('Connected to Redis');
});

redis.on("error", function(error) {
    console.error(`Redis error: ${error}`);
});

export default redis;
