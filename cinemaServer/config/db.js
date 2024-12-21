const mongoose = require("mongoose");

const connectDB = () => {
  mongoose
    .connect("mongodb://127.0.0.1:27017/CinemaDB")
    .then(console.log("CinemaDB is connected successfully...."))
    .catch("Failed to connect to CinemaDB");
};

module.exports = connectDB;
