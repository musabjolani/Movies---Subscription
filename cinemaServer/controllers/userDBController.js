const express = require("express");
const router = express.Router();
const userDBServ = require("../services/userDBServ");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    res.json(await userDBServ.getAllUsers());
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.get("/getLoggedUserDetails", (req, res) => {
  res.json({ user: req.user });
});

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
  try {
    const { userName, password } = req.body;
    return res.json(await userDBServ.login(userName, password));
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;

router.post("/register", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await userDBServ.getUserAuth(userName);
    if (!user)
      return res.status(401).json({ message: "userName ia not exist" });
    const hashedPassword = await bcrypt.hash(password, 10);
    res.json(
      await userDBServ.updateUserByID(user._id, { password: hashedPassword })
    );
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
router.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    res.json(await userDBServ.deleteUserByUserId(userId));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

module.exports = router;
