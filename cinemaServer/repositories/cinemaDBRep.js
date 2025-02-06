const User = require("../models/userModel");

const getAllUsers = () => {
  return User.find();
};
const getUserByID = (id) => {
  return User.findById(id);
};
const getUserByUserId = (userId) => {
  return User.findOne({ userId: userId });
};

const getUserAuth = (userName) => {
  return User.findOne({ userName: userName });
};

const addUser = async (user) => {
  const newUser = new User(user);
  await newUser.save();
  return "User Added ";
};

const updateUserByID = async (id, user) => {
  await User.findByIdAndUpdate(id, user);
  return "User Updated";
};
const deleteUser = async (id) => {
  await User.findByIdAndDelete(id);
  return "User Deleted";
};

module.exports = {
  getAllUsers,
  getUserByID,
  getUserByUserId,
  getUserAuth,
  addUser,
  updateUserByID,

  deleteUser,
};
