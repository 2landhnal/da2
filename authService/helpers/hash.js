'use strict';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SALT_ROUND = 10;

export const genSalt = async () => {
    return await bcrypt.genSalt(SALT_ROUND);
};

export const createTokenPair = async (payload) => {
    try {
        const accessToken = await jwt.sign(payload, process.env.accessKey, {
            expiresIn: '5m',
        });
        const refreshToken = await jwt.sign(payload, process.env.refreshKey, {
            expiresIn: '10m',
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
