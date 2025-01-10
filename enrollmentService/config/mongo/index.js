import mongoose from 'mongoose';

const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Mongoose connected'));

export const connectMongoose = async () =>
    await mongoose.connect(process.env.enrollDb);
