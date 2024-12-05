const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
var cors = require('cors');

const router = require('./routes');

const app = express();

// Enable CORS for all routes
app.use(
    cors({
        origin: 'http://localhost:3000', // Frontend URL
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
        credentials: true, // If your request includes cookies or authentication
    }),
);

app.use(express.static('public'));
app.use(express.json());
app.use('/', router);

app.listen(process.env.PORT || 3000);
