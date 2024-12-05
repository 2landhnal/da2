const express = require("express");
const router = express.Router();
const documentRoute = require("./document");

router.use("/", documentRoute);

module.exports = router;
