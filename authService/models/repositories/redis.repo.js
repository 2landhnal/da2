'use strict';
import { redisClient } from '../../config/redis/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const incr = async (key) => {
    return await await redisClient.incr(key);
};

export const get = async (key) => {
    return await redisClient.get(key);
};

export const expire = async (key, tt) => {
    await redisClient.set(key, 0, 'EX', tt);
};

export const exists = async (key) => {
    const value = await redisClient.get(key);
    if (value) {
        return true;
    }
    return false;
};

export const pushToList = async (listKey, value) => {
    await redisClient.lPush(listKey, value);
};

export const valueExistsInList = async (listKey, value) => {
    const listValues = await redisClient.lRange(listKey, 0, -1);
    return listValues.includes(value);
};

export const valueExistInHashedList = async (listKey, plain) => {
    const listValues = await redisClient.lRange(listKey, 0, -1);
    console.log({ listValues });
    for (const value of listValues) {
        const same = await bcrypt.compare(plain, value);
        if (same) return true;
    }
    return false;
};

export const isRefreshTokenValid = async (plainToken) => {
    const stillWell = await jwt.verify(plainToken, process.env.refreshKey);
    if (!stillWell) return false;
    const payload = await jwt.decode(plainToken);
    const { email } = payload;
    const isValid = await valueExistInHashedList(
        `refreshToken:${email}`,
        plainToken,
    );
    return isValid;
};

export const saveRefreshToken = async (email, plainToken) => {
    const MAX_TOKENS = 5;
    const hashed = await bcrypt.hash(plainToken, 10);
    // Thêm token mới và giới hạn danh sách
    await pushToList(`refreshToken:${email}`, hashed);
    await redisClient.lTrim(`refreshToken:${email}`, 0, MAX_TOKENS - 1);
};

export const removeRefreshToken = async (email, token) => {
    const listValues = await redisClient.lRange(`refreshToken:${email}`, 0, -1);
    for (let hashedToken of listValues) {
        const isMatch = await bcrypt.compare(token, hashedToken);
        if (isMatch) {
            await redisClient.lRem(`refreshToken:${email}`, 1, hashedToken);
            console.log(`Removed ${hashedToken}`);
            return true;
        }
    }
    return false;
};
