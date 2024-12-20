import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req, res, next) => {
    console.log('authMiddleware called');
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ msg: 'Access token required' });
        return;
    }

    jwt.verify(token, process.env.secretTokenKey, (err, tokenData) => {
        if (err) {
            res.status(403).json({ msg: 'Invalid access token' });
            return;
        }
        req.tokenData = tokenData;
        next();
    });
};

const adminMiddleware = (req, res, next) => {
    console.log('adminMiddleware called');
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ msg: 'Access token required' });
        return;
    }

    jwt.verify(token, process.env.secretTokenKey, (err, tokenData) => {
        if (err) {
            res.status(403).json({ msg: 'Invalid access token' });
            return;
        }

        const { role } = tokenData;
        if (role !== 1) {
            res.status(403).json({ msg: 'Admin access required' });
            return;
        }
        req.tokenData = tokenData;
        next();
    });
};

const teacherMiddleware = (req, res, next) => {
    console.log('teacherMiddleware called');
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        res.status(401).json({ msg: 'Access token required' });
        return;
    }

    jwt.verify(token, process.env.secretTokenKey, (err, tokenData) => {
        if (err) {
            res.status(403).json({ msg: 'Invalid access token' });
            return;
        }

        const { role } = tokenData;
        if (role > 2) {
            res.status(403).json({ msg: 'Teacher access required' });
            return;
        }
        req.tokenData = tokenData;
        next();
    });
};

const openMiddleware = (req, res, next) => {
    console.log('openMiddleware called');
    next();
};

export { adminMiddleware, teacherMiddleware, authMiddleware, openMiddleware };
