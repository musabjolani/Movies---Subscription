const CinemaDBRep = require("../repositories/cinemaDBRep");

const getAllUsers = () => {
  return CinemaDBRep.getAllUsers();
};
const getUserByID = (id) => {
  return CinemaDBRep.getUserByID(id);
};
const getUserByUserId = (userId) => {
  return CinemaDBRep.getUserByUserId(userId);
};

const getUserAuth = (userName) => {
  return CinemaDBRep.getUserAuth(userName);
};

const addUser = (user) => {
  return CinemaDBRep.addUser(user);
};
const updateUserByID = (id, user) => {
  return CinemaDBRep.updateUserByID(id, user);
};
const updateUserByUserId = async (userId, user) => {
  const existingUser = await getUserByUserId(userId);
  if (existingUser?._id) return updateUserByID(existingUser._id, user);
  throw error;
};

const deleteUserByUserId = async (userId) => {
  const existingUser = await getUserByUserId(userId);
  if (existingUser?._id) return CinemaDBRep.deleteUser(existingUser._id);
  throw error;
};

module.exports = {
  getAllUsers,
  getUserByID,
  getUserByUserId,
  getUserAuth,
  addUser,
  updateUserByID,
  updateUserByUserId,
  deleteUserByUserId,
};
