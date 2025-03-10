'use strict';
import express from 'express';
import studentRouter from './student.router.js';
import testRouter from './test.router.js';
import { extractInfor } from '../middlewares/infor.middleware.js';

const router = express.Router();

router.get('/healthCheck', (req, res, next) => {
    console.log(req.cookies);
    res.status(200).send({ msg: 'Auth service' });
});

router.use(extractInfor);
router.use('/v1/api', studentRouter);
router.use('/test', testRouter);

export default router;
