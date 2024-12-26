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

export const getRedisClient = () => redisCli;
