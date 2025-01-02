const express = require("express");
const memberServ = require("../services/memberServ");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(await memberServ.getAllMembers());
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.post("/copyMembersWsToDB", async (req, res) => {
  try {
    const { data } = await memberServ.getMembersWS();
    data.map(async (member) => {
      await memberServ.addMember({
        name: member.name,
        email: member.email,
        city: member.address.city,
      });
    });
    res.json("done");
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await memberServ.getMemberByID(id));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.post("/", async (req, res) => {
  try {
    const member = req.body;
    res.json(await memberServ.addMember(member));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const member = req.body;
    res.json(await memberServ.updateMember(id, member));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await memberServ.deleteMember(id));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

module.exports = router;
