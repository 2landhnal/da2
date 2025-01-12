const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleware = (req, res, next) => {
    console.log('authMiddleware called');
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ msg: 'Access token required' });
        return;
    }

    jwt.verify(token, process.env.accessKey, (err, tokenData) => {
        if (err) {
            res.status(403).json({ msg: 'Invalid access token' });
            return;
        }
        req.headers['x-user-id'] = tokenData.uid;
        req.headers['x-user-role'] = tokenData.role;
        next();
    });
};

const openMiddleware = (req, res, next) => {
    console.log('openMiddleware called');
    req.headers['x-user-id'] = null;
    req.headers['x-user-role'] = null;
    next();
};

module.exports = { authMiddleware, openMiddleware };
