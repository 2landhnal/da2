const express = require('express');
const router = express.Router();
const accountRoute = require('./course');
// const Book = require("../models/book");

router.use('/', accountRoute);

module.exports = router;
