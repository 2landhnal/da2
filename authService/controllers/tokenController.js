const jwt = require('jsonwebtoken');
const { RefreshToken, findHashedToken } = require('../models/refreshToken');
const { getorCache } = require('../ultis/helper');

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

    // [POST] /refreshAccessToken
    refreshAccessToken = async (req, res, next) => {
        console.log('Refresh access token called');
        const authHeader = req.headers['authorization'];
        const refreshToken = authHeader && authHeader.split(' ')[1];
        if (refreshToken == null) return res.sendStatus(401);

        const { err, accessToken } = await this.getNewAccessToken(refreshToken);
        if (err) {
            return res.sendStatus(403);
        }

        res.send({ accessToken });
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

    // use in this service only
    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, tokenData) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            req.body.accountId = tokenData.accountId;
            next();
        });
    }

    // use in this service only
    authenticateAdminToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, tokenData) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            if (tokenData.role != 1) {
                console.log('Admin required!');
                return res.sendStatus(403);
            }
            req.body.accountId = tokenData.accountId;
            req.body.tokenData = tokenData;
            next();
        });
    }

    //[GET] /testCheckAdmin
    checkAdmin(req, res) {
        res.json({ msg: 'Admin okay' });
    }

    //[GET] /testCheckAdmin
    checkAuth(req, res) {
        res.json({ msg: 'Auth okay' });
    }

    // [GET] /validateToken
    // use for another service
    validateToken(req, res) {
        console.log(`${Date().toLocaleString()} Validate token called`);
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            console.log('No token');
            return res.status(401).send({ msg: 'Token is required' });
        }

        jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, tokenData) => {
            if (err) {
                console.error('Token verification failed:', err);
                return res.status(403).send({ msg: 'Invalid token' });
            }
            // Trả về accountId nếu token hợp lệ
            console.log('Access token valid');
            res.status(200).send({ accountId: tokenData.accountId });
        });
    }
}

module.exports = new TokenController();
