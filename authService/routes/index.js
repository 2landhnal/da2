const express = require("express");
const router = express.Router();
const accountRoute = require("./account");
// const Book = require("../models/book");

router.use("/", accountRoute);

module.exports = router;
