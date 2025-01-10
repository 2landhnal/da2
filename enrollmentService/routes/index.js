'use strict';
import express from 'express';
import enrollmentRouter from './enrollment.router.js';
import testRouter from './test.router.js';
import { extractInfor } from '../middlewares/infor.middleware.js';
import { authRequired } from '../middlewares/auth.middleware.js';

const router = express.Router();
router.get('/healthCheck', (req, res, next) => {
    res.status(200).send({ msg: 'Auth service' });
});

router.use(extractInfor);
router.use(authRequired);
router.use('/v1/api', enrollmentRouter);
router.use('/test', testRouter);

export default router;
