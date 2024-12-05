import express from 'express';
import router from './src/routes';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000', // Frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        credentials: true, // If your request includes cookies or authentication
    }),
);

app.use(express.json());
app.use('/', router);

//console.log(process.env.DB_URL);

mongoose.connect(process.env.DB_URL as string);
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Mongoose connected'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
