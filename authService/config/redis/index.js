import * as Redis from 'redis';

let redisCli;

export const connectRedis = async () => {
    try {
        const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';
        redisCli = Redis.createClient({ url: redisURL });

        redisCli.on('error', (err) =>
            console.error('Redis Client Error:', err),
        );
        redisCli.once('connect', () =>
            console.log('Redis connected successfully'),
        );

        await redisCli.connect();
    } catch (error) {
        console.error('Error connecting to Redis:', error);
        process.exit(1); // Exit process if Redis connection fails
    }
};

export const getRedisClient = () => {
    if (!redisCli) {
        throw new Error(
            'Redis client is not initialized. Call connectRedis() first.',
        );
    }
    return redisCli;
};
