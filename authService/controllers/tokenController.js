const jwt = require('jsonwebtoken');
const { RefreshToken, findHashedToken } = require('../models/refreshToken');

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
            const newAccessToken = await this.generateAccessToken({
                accountId: account.accountId,
            });
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

    authenticateToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.SECRET_TOKEN_KEY, (err, account) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            req.body.accountId = account.accountId;
            next();
        });
    }
}

module.exports = new TokenController();
