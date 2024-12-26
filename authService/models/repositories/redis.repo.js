import { redisClient } from '../../config/redis/index.js';

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
    await redisClient.lPush(listKey, value);
};

const valueExistsInList = async (listKey, value) => {
    const listValues = await redisClient.lRange(listKey, 0, -1);
    return listValues.includes(value);
};

export { incr, expire, exists, get, pushToList, valueExistsInList };
