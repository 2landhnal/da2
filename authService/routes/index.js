'use strict';
import express from 'express';
import accountRouter from './account.router.js';
import testRouter from './test.router.js';

const router = express.Router();

router.use('/v1/api', accountRouter);
router.use('/test', testRouter);

router.get('/healthCheck', (req, res, next) => {
    console.log(req.cookies);
    res.status(200).send({ msg: 'Auth service' });
});

export default router;
