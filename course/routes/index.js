'use strict';
import express from 'express';
import courseRouter from './course.router.js';
import testRouter from './test.router.js';
import { extractInfor } from '../middlewares/infor.middleware.js';

const router = express.Router();

router.use(extractInfor);
router.use('/v1/api', courseRouter);
router.use('/test', testRouter);

router.get('/healthCheck', (req, res, next) => {
    console.log(req.cookies);
    res.status(200).send({ msg: 'Auth service' });
});

export default router;
