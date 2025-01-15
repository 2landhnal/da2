'use strict';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import router from './routes/index.js';
import { connectRabbitMQ } from './config/messageQueue/connect.js';
import { connectMongoose } from './config/mongo/index.js';
import { firestore, bucket } from './config/firebase/index.js';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { init } from './config/gRPC/enrollment.grpc.server.js';

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware để giới hạn kích thước yêu cầu
app.use((req, res, next) => {
    bodyParser.json({ limit: '2mb' })(req, res, (err) => {
        if (
            err &&
            err instanceof SyntaxError &&
            err.status === 413 &&
            err.message === 'Request body is too large'
        ) {
            throw new RequestTooLong('Error: Request too long');
        } else {
            next();
        }
    });
});

app.use('/', router);

// handling error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    const status = error.status || 500;
    return res.status(status).json({
        status: 'error',
        code: status,
        stack: error.stack,
        message: error.message || 'Interal Server Error',
    });
});

const startApp = async () => {
    // mongoDB
    await connectMongoose();

    // connectMQ
    await connectRabbitMQ();

    // firebase
    if (firestore && bucket) {
        1 + 1;
    }

    // grpc server
    init();
};

startApp();

export default app;
