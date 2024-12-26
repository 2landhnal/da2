'use strict';
import express from 'express';
import cors from 'cors';
import * as Redis from 'redis';

const DEFAULT_EXPIRE = 60;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const redisURL = process.env.redisUrl | 'redis://localhost:6379'; // Replace with your Redis URL
const redisCli = Redis.createClient({
    url: redisURL,
});

redisCli.on('error', (err) => console.error('Redis Client Error', err));
redisCli.once('connect', () => console.error('Redis connected'));
redisCli.connect().catch(console.error);

// TypeScript implementation of tryGetFromCache
async function tryGetFromCache(key, expireTimeInMinute, callback) {
    try {
        const cachedData = await redisCli.get(key);
        if (cachedData != null) {
            console.log('Cache hit');
            return JSON.parse(cachedData);
        }
        console.log('Cache miss');
        const freshData = await callback();
        await redisCli.setEx(
            key,
            (expireTimeInMinute || DEFAULT_EXPIRE) * 60,
            JSON.stringify(freshData),
        );
        return freshData;
    } catch (err) {
        console.error(`Error in tryGetFromCache for key: ${key}`, err);
        throw err;
    }
}

export { tryGetFromCache };
