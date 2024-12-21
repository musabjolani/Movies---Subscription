const express = require("express");
const router = express.Router();
const permissionsJSONServ = require("../services/permissionsJSONServ");

router.get("/", async (req, res) => {
  try {
    res.json(await permissionsJSONServ.getAllPermissions());
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await permissionsJSONServ.getPermissionByID(id));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.post("/", async (req, res) => {
  try {
    const permission = req.body;
    res.json(await permissionsJSONServ.addPermission(permission));
  } catch (error) {
    res.status(404).json(error.message);
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const permission = req.body;
    res.json(await permissionsJSONServ.updatePermission(id, permission));
  } catch (error) {
    res.status(404).json(error.message);
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await permissionsJSONServ.deletePermission(id));
  } catch (error) {
    res.status(404).json(error.message);
  }
});

module.exports = router;
