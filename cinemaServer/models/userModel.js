const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String },
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema, "Users");

module.exports = User;
