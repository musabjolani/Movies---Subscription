const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { versionKey: false }
);

const User = mongoose.model("User", userSchema, "Users");

module.exports = User;
