const jwt = require('jsonwebtoken');
const { RefreshToken, findHashedToken } = require('../models/refreshToken');
const { getorCache } = require('../ultis/helper');

class TokenController {
    generateAccessToken = async (account) => {
        return jwt.sign(account, process.env.SECRET_TOKEN_KEY, {
            expiresIn: '20m',
        });
    };

    getNewAccessToken = async (refreshToken) => {
        const isValid = await findHashedToken(refreshToken);
        if (isValid === null) {
            console.log('Refresh token is not in list');
            return { err: 'Refresh token invalid' };
        }

        try {
            const account = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
            console.log(account);
            const newAccessToken = await this.generateAccessToken(account);
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

    generatePairToken = async (account) => {
        const accessToken = await this.generateAccessToken(account);
        const refreshToken = await jwt.sign(account, process.env.REFRESH_TOKEN);
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
            console.log(tokenData);
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

    // [GET] /validateToken
    // use for another service
    validateToken(req, res) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).send({ msg: 'Token is required' });

        jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, account) => {
            if (err) {
                console.error('Token verification failed:', err);
                return res.status(403).send({ msg: 'Invalid token' });
            }
            // Trả về accountId nếu token hợp lệ
            res.status(200).send({ accountId: account.accountId });
        });
    }
}

module.exports = new TokenController();
