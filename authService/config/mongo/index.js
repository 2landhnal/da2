import mongoose from 'mongoose';

// mongoDB
export const setUpMongoose = async () => {
    await mongoose.connect(process.env.authDb);
    const db = mongoose.connection;
    db.on('error', (err) => console.error(err));
    db.once('open', () => console.log('Mongoose connected'));
};
