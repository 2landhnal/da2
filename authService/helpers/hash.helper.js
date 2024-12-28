'use strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ACCESSTOKEN_TIME, REFRESHTOKEN_TIME } from '../config/const.config.js';
import { getInfoData } from '../utils/index.js';

const SALT_ROUND = 10;

export const verifyRefreshToken = async (token) => {
    const valid = await jwt.verify(token, process.env.refreshKey);
    return valid;
};

export const verifyAccessToken = async (token) => {
    const valid = await jwt.verify(token, process.env.accessKey);
    return valid;
};

export const genSalt = async () => {
    return await bcrypt.genSalt(SALT_ROUND);
};

export const createAccessToken = async (payload) => {
    try {
        const orgPayload = getInfoData({
            fileds: ['uid', 'email', 'role', 'fullname'],
            object: payload,
        });
        const accessToken = await jwt.sign(orgPayload, process.env.accessKey, {
            expiresIn: ACCESSTOKEN_TIME,
        });

        jwt.verify(accessToken, process.env.accessKey, (err, decode) => {
            if (err) {
                console.error('error verify', err);
            } else {
                // console.log('decode verify', decode);
            }
        });
        return { accessToken };
    } catch (error) {
        console.log(error);
    }
};

export const createTokenPair = async (payload) => {
    try {
        const accessToken = await jwt.sign(payload, process.env.accessKey, {
            expiresIn: ACCESSTOKEN_TIME,
        });
        const refreshToken = await jwt.sign(payload, process.env.refreshKey, {
            expiresIn: REFRESHTOKEN_TIME,
        });

        jwt.verify(accessToken, process.env.accessKey, (err, decode) => {
            if (err) {
                console.error('error verify', err);
            } else {
                // console.log('decode verify', decode);
            }
        });
        return { accessToken, refreshToken };
    } catch (error) {}
};
