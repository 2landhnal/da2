'use strict';
import express from 'express';
import accountRouter from './account.router.js';

const router = express.Router();

router.use('/v1/api/auth', accountRouter);

router.get('/healthCheck', (req, res, next) => {
    res.status(200).send({ msg: 'Auth service' });
});

export default router;
