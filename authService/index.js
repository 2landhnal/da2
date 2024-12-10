const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const router = require('./routes');

const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/', router);

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on('error', (err) => console.error(err));
db.once('open', () => console.log('Mongoose connected'));
console.log(`Listening on port ${process.env.PORT || 3000}`);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
