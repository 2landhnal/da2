const express = require("express");
const router = express.Router();
const userRoute = require("./user");
// const Book = require("../models/book");

router.use("/", userRoute);

module.exports = router;
