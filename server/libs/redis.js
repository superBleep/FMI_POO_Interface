import redis from 'redis';
import RedisStore from 'connect-redis';

export const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error: ' + err);
});

export const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'fmiappsid:',
});
