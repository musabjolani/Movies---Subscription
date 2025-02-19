const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const connectDB = () => {
  mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(console.log("CinemaDB is connected successfully...."))
    .catch("Failed to connect to CinemaDB");
};

module.exports = connectDB;
