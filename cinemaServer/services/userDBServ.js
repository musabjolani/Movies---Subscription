const CinemaDBRep = require("../repositories/cinemaDBRep");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Define at the top
const permissionsJSONServ = require("../services/permissionsJSONServ");
const dotenv = require("dotenv").config();
const usersJSONServ = require("../services/usersJSONServ");

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

const getLoggedUserDetails = (authHeader) => {
  const token = authHeader.split(" ")[1];
  if (!token) throw Error({ message: "Invalid Token" });
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};

const login = async (userName, password) => {
  try {
    // Handle SYSAdmin login (Hardcoded Admin Credentials - Ideally store securely)
    if (userName.toLowerCase() === process.env.SYSADMIN_USER) {
      if (password != process.env.SYSADMIN_PASS)
        throw new Error("Invalid password");
      const token = jwt.sign(
        {
          userId: process.env.SYSADMIN_ID,
          isAdmin: true,
          permissions: [],
          firstName: "SYS",
          lastName: "Admin",
        },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );
      return token; //  Return token properly
    }

    // Retrieve user from DB (Ensure case-insensitive search)

    const loggedUser = await getUserAuth(userName);

    if (!loggedUser) throw new Error("Invalid username");

    // Check if the user has a password set (Prompt for reset if missing)
    if (!loggedUser.password) {
      throw new Error("Invalid password");
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, loggedUser.password);

    if (!passwordMatch) {
      throw new Error("Invalid password");
    }

    const { permissions } = await permissionsJSONServ.getPermissionByID(
      loggedUser.userId
    );

    const user = await usersJSONServ.getUserByID(`${loggedUser.userId}`);
    if (!user) {
      console.error("Invalid user data received:", user);
      return;
    }

    // Generate JWT token

    const token = jwt.sign(
      {
        userId: loggedUser.userId,
        isAdmin: false,
        permissions: permissions,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      SECRET_KEY,
      {
        expiresIn: "1h",
      }
    );
    return token;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const register = async (userName, password) => {
  try {
    const user = await getUserAuth(userName);
    if (!user) throw new Error("userName ia not exist");
    const hashedPassword = await bcrypt.hash(password, 10);
    return await updateUserByID(user._id, {
      password: hashedPassword,
    });
  } catch (error) {
    console.error("Register error:", error);
    throw error;
  }
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
  //throw error;
};

module.exports = {
  getAllUsers,
  getUserByID,
  getUserByUserId,
  getUserAuth,
  getLoggedUserDetails,
  addUser,
  register,
  login,
  updateUserByID,
  updateUserByUserId,
  deleteUserByUserId,
};
