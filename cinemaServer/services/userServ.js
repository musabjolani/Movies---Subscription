const CinemaDBRep = require("../repositories/cinemaDBRep");

const getAllUsers = () => {
  return CinemaDBRep.getAllUsers();
};
const getUserByID = () => {
  return CinemaDBRep.getAllUsers();
};

const addUser = (user) => {
  return CinemaDBRep.addUser(user);
};
const updateUser = (id, user) => {
  return CinemaDBRep.updateUser(id, user);
};
const deleteUser = (id) => {
  return CinemaDBRep.deleteUser(id);
};

module.exports = {
  getAllUsers,
  getUserByID,
  addUser,
  updateUser,
  deleteUser,
};
