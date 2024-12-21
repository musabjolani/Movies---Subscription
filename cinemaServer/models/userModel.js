const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  { userName: String, password: String },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema, "Users");

module.exports = User;
