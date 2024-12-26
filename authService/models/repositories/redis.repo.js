import { getRedisClient } from '../../config/redis';

const redisClient = getRedisClient();

const incr = async (key) => {
    return await await redisClient.incr(key);
};

const get = async (key) => {
    return await redisClient.get(key);
};

const expire = async (key, tt) => {
    await redisClient.set(key, 0, 'EX', tt);
};

const exists = async (key) => {
    const value = await redisClient.get(key);
    if (value) {
        return true;
    }
    return false;
};

const pushToList = async (listKey, value) => {
    await redisClient.lpush(listKey, value);
};

const valueExistsInList = async (listKey, value) => {
    const listValues = await redisClient.lrange(listKey, 0, -1);
    return listValues.includes(value);
};

const tryGetFromCache = async (key, expireTimeInMinute, callback) => {
    try {
        const cachedData = await get(key);
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
};

export {
    incr,
    expire,
    exists,
    get,
    pushToList,
    valueExistsInList,
    tryGetFromCache,
};
