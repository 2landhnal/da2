import { redisClient } from '../config/redis/index.js';

export const tryGetFromCache = async (key, expireTimeInMinute, callback) => {
    try {
        const cachedData = await get(key);
        if (cachedData != null) {
            console.log('Cache hit');
            return JSON.parse(cachedData);
        }
        console.log('Cache miss');
        const freshData = await callback();
        await redisClient.setEx(
            key,
            (expireTimeInMinute || DEFAULT_EXPIRE) * 60,
            JSON.stringify(freshData),
        );
        return freshData;
    } catch (err) {
        console.error(`Error in tryGetFromCache for key: ${key}`, err);
        throw err;
    }
};
