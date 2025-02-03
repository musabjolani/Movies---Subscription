const fileJSONRep = require("../repositories/fileJSONRep");
const filePath = "./data/Users.json";
const { v4: uuidv4 } = require("uuid");

const getAllUsers = async () => {
  return await fileJSONRep.getAllFileData(filePath);
};
const getUserByID = async (id) => {
  const users = await fileJSONRep.getAllFileData(filePath);
  return users.filter((user) => user.id === id);
};

const addUser = async (user) => {
  const users = await fileJSONRep.getAllFileData(filePath);
  const newUser = { ...user, id: uuidv4() };
  await fileJSONRep.updateFile(filePath, [...users, newUser]);
  return newUser;
};

const updateUser = async (id, user) => {
  const users = await fileJSONRep.getAllFileData(filePath);
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) return "User Not Found";
  users[index] = user;
  return await fileJSONRep.updateFile(filePath, users);
};
const deleteUser = async (id) => {
  const users = await fileJSONRep.getAllFileData(filePath);
  const usersWithoutDletedUser = users.filter((user) => user.id != id);
  return await fileJSONRep.updateFile(filePath, usersWithoutDletedUser);
};

module.exports = { getAllUsers, getUserByID, addUser, updateUser, deleteUser };
