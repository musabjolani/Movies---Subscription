const express = require("express");
const router = express.Router();
const userServ = require("../services/userServ");

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
