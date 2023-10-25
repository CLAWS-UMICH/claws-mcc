import Redis from 'ioredis';

const redis = new Redis({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
});

redis.on("connect", function() {
    console.log('Connected to Redis');
});

redis.on("error", function(error) {
    console.error(`Redis error: ${error}`);
});

export default redis;
