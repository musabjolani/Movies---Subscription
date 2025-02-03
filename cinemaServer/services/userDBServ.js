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
  const data = await getUserByUserId(userId);
  return updateUserByID(data._id, user);
};
const deleteUser = (id) => {
  return CinemaDBRep.deleteUser(id);
};

module.exports = {
  getAllUsers,
  getUserByID,
  getUserByUserId,
  getUserAuth,
  addUser,
  updateUserByID,
  updateUserByUserId,
  deleteUser,
};
