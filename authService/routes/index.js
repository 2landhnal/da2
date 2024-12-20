import express from 'express';
import openRoute from './openRoute.js';
import authRequiredRoute from './authRequired/index.js';
import teacherRequiredRoute from './teacherRequired/index.js';
import adminRequiredRoute from './adminRequired/index.js';
import { tokenDataMiddleware } from '../middlewares/index.js';

const router = express.Router();

router.use(
    '/adminRequired',
    (req, res, next) => {
        console.log({ msg: 'adminRequired route accessed' });
        next();
    },
    tokenDataMiddleware,
    adminRequiredRoute,
);

router.use(
    '/teacherRequired',
    (req, res, next) => {
        console.log({ msg: 'teacherRequired route accessed' });
        next();
    },
    tokenDataMiddleware,
    teacherRequiredRoute,
);

router.use(
    '/authRequired',
    (req, res, next) => {
        console.log({ msg: 'authRequired route accessed' });
        next();
    },
    tokenDataMiddleware,
    authRequiredRoute,
);

router.use(
    '/',
    (req, res, next) => {
        console.log({ msg: 'openRoute accessed' });
        next();
    },
    openRoute,
);

router.get('/', (req, res, next) => {
    res.status(200).send({ msg: 'Auth service' });
});

export default router;
