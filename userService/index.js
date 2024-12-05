const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");

const router = require("./routes");

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use("/", router);

mongoose.connect(process.env.DB_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Mongoose connected"));

app.listen(process.env.PORT || 3000);
