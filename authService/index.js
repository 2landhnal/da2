import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import router from './routes/index.js';
import { connectRabbitMQ } from './messageQueue/connect.js';
import { setupConsumers } from './messageQueue/consumer.js';
import { setupProducers } from './messageQueue/producer.js';
import { firestore, bucket } from './config/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', router);

// mongoDB
mongoose.connect(process.env.authDb);
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Mongoose connected'));

// connectMQ
await connectRabbitMQ();
setupProducers();
setupConsumers();

// firebase
if (firestore && bucket) {
    1 + 1;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
