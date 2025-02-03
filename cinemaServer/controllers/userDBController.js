const express = require("express");
const router = express.Router();
const userDBServ = require("../services/userDBServ");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv").config();
const authMiddleware = require("../middleware/authMiddleware");
const rolesMiddleware = require("../middleware/rolesMiddleware");

router.get(
  "/",
  authMiddleware.varifyToken,
  rolesMiddleware.OnlyAdminRole(true),
  async (req, res) => {
    try {
      res.json(await userDBServ.getAllUsers());
    } catch (error) {
      res.json(res.status(404).json(error.message));
    }
  }
);

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    res.json(await userDBServ.getUserByUserId(userId));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    // if 'username' is exist in the DB
    const userDB = await userDBServ.getUserAuth(user.userName);
    if (userDB)
      return res.status(401).json({ message: " userName already Exist !!!" });
    res.json(await userDBServ.addUser(user));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    // if 'username' is exist in the DB
    const user = await userDBServ.getUserAuth(userName);
    if (!user) return res.status(401).json({ message: "Invalid userName" });
    if (!(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid password" });
    const SECRET_KEY = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(
      { userName: user.userName, isAdmin: user.isAdmin },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
router.post("/register", async (req, res) => {
  try {
    const user = req.body;
    const UserExist = await userDBServ.getUserAuth(user.userName);
    if (UserExist)
      return res.status(401).json({ message: "userName ia already exist" });
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    res.json(await userDBServ.addUser(user));
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = req.body;
    res.json(await userDBServ.updateUserByUserId(userId, user));
  } catch (error) {
    res.status(404).json(error.message);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await userDBServ.deleteUser(id));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

module.exports = router;
