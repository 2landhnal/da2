"use strict"
import jwt from 'jsonwebtoken';
import { RefreshToken, findHashedToken } from '../models/refreshToken.js';

const expireDuration = '20m';

class TokenController {
    generateToken = async (tokenData, key, expiresIn = '') => {
        const payload = {
            ...tokenData,
            iat: Math.floor(Date.now() / 1000), // Add current timestamp
        };
        const options = {};
        if (expiresIn != '') {
            options.expiresIn = expiresIn;
        }
        return jwt.sign(payload, key, options);
    };

    getNewAccessToken = async (refreshToken) => {
        // check if exist in db
        const isValid = await findHashedToken(refreshToken);
        if (isValid === null) {
            console.log('Refresh token is not in list');
            return { err: 'Refresh token invalid' };
        }

        try {
            const tokenData = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN,
            );
            console.log(tokenData);
            const newAccessToken = await this.generateToken(
                tokenData,
                process.env.SECRET_TOKEN_KEY,
                expireDuration,
            );
            return { accessToken: newAccessToken };
        } catch (err) {
            return { err: 'Invalid token' };
        }
    };

    generatePairToken = async (tokenData) => {
        const accessToken = await this.generateToken(
            tokenData,
            process.env.SECRET_TOKEN_KEY,
            expireDuration,
        );
        const refreshToken = await this.generateToken(
            tokenData,
            process.env.REFRESH_TOKEN,
        );
        const refreshTokenToPush = new RefreshToken({ token: refreshToken });
        await refreshTokenToPush.save();
        console.log('Push refresh token success');
        return { accessToken, refreshToken };
    };

    removeRefreshToken = async (refreshToken) => {
        if (!refreshToken) {
            throw new Error('Refresh token is required');
        }

        const hashedToken = await findHashedToken(refreshToken);
        await RefreshToken.deleteOne({ token: hashedToken });

        console.log(`Hashed token ${hashedToken} removed from list`);
    };

    // [POST] /refreshAccessToken
    refreshAccessToken = async (req, res, next) => {
        console.log('Refresh access token called');
        const authHeader = req.headers['authorization'];
        const refreshToken = authHeader && authHeader.split(' ')[1];
        if (refreshToken == null) return res.sendStatus(401);
        const { err, accessToken } = await this.getNewAccessToken(refreshToken);
        if (err) {
            return res.status(403).json({ err });
        }
        res.status(200).json({ accessToken });
    };

    //[GET]
    checkAccess(req, res) {
        res.status(200).json({ msg: 'Okay' });
    }
}

export default new TokenController();
