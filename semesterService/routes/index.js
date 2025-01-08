'use strict';
import express from 'express';
import semesterRouter from './semetser.router.js';
import scheduleRouter from './schedule.router.js';
import testRouter from './test.router.js';
import { extractInfor } from '../middlewares/infor.middleware.js';

const router = express.Router();
router.get('/healthCheck', (req, res, next) => {
    res.status(200).send({ msg: 'Auth service' });
});

router.use(extractInfor);
router.use('/v1/api/schedule', scheduleRouter);
router.use('/v1/api', semesterRouter);
router.use('/test', testRouter);

export default router;
