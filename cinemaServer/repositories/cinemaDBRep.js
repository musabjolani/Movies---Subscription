const User = require("../models/userModel");

const getAllUsers = () => {
  return User.find();
};
const getAllUserByID = (id) => {
  return User.findById(id);
};

const getUserAuth = (userName) => {
  return User.findOne({ userName: userName });
};

const addUser = async (user) => {
  const newUser = new User(user);
  await newUser.save();
  return "User Added ";
};

const updateUser = async (id, user) => {
  await User.findByIdAndUpdate(id, user);
  return "User Updated";
};
const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
  return "User Deleted";
};

module.exports = {
  getAllUsers,
  getAllUserByID,
  getUserAuth,
  addUser,
  updateUser,
  deleteUser,
};
