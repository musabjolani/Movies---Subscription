const express = require("express");
const router = express.Router();
const userServ = require("../services/userServ");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    res.json(await userServ.getAllUsers());
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await userServ.getUserByID(id));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    res.json(await userServ.addUser(user));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.post("/", async (req, res) => {
  const { userName, password } = req.body;

  // if 'username' and 'password' are exist in the DB
  const user = await userServ.getUserAuth(userName, password);

  if (user) {
    const userId = "IIhjjkuiuijk";
    const SECRET_KEY = "1982738aksjldjasdl";
    const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ token });
  } else return res.json({ token: "" });
});

module.exports = router;
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body;
    res.json(await userServ.updateUser(id, user));
  } catch (error) {
    res.status(404).json(error.message);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await userServ.deleteUser(id));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

module.exports = router;
