const express = require("express");
const router = express.Router();
const usersJSONServ = require("../services/usersJSONServ");

router.get("/", async (req, res) => {
  try {
    res.json(await usersJSONServ.getAllUsers());
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await usersJSONServ.getUserByID(id));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = req.body;
    res.json(await usersJSONServ.addUser(user));
  } catch (error) {
    res.status(404).json(error.message);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.body;
    res.json(await usersJSONServ.updateUser(id, user));
  } catch (error) {
    res.status(404).json(error.message);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await usersJSONServ.deleteUser(id));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

module.exports = router;