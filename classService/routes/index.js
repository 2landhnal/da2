'use strict';
import express from 'express';
import shiftRouter from './shift.router.js';
import roomRouter from './room.router.js';
import classRouter from './class.router.js';
import testRouter from './test.router.js';
import { extractInfor } from '../middlewares/infor.middleware.js';

const router = express.Router();
router.get('/healthCheck', (req, res, next) => {
    res.status(200).send({ msg: 'Auth service' });
});

router.use(extractInfor);
// router.use('/v1/api', classRouter);
router.use('/v1/api/room', roomRouter);
router.use('/v1/api/shift', shiftRouter);
router.use('/test', testRouter);

export default router;
