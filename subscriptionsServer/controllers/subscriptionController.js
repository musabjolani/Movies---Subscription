const express = require("express");
const subscriptionServ = require("../services/subscriptionServ");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(await subscriptionServ.getAllSubscriptions());
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.get("/getAllMembersWithMovies", async (req, res) => {
  try {
    res.json(await subscriptionServ.getAllMembersWithMovies());
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.get("/getAllMoviesWithMembers", async (req, res) => {
  try {
    res.json(await subscriptionServ.getAllMoviesWithMembers());
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await subscriptionServ.getSubscriptionByID(id));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.get("/members/:movieId", async (req, res) => {
  try {
    const { movieId } = req.params;
    res.json(await subscriptionServ.getMembersByMovies(movieId));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.get("/movies/:memberId", async (req, res) => {
  try {
    const { memberId } = req.params;
    res.json(await subscriptionServ.getMoviesByMember(memberId));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.post("/", async (req, res) => {
  try {
    const subscription = req.body;
    res.json(await subscriptionServ.addSubscription(subscription));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.post("/addmovietosubscription", async (req, res) => {
  try {
    const memberWithMovie = req.body;
    res.json(await subscriptionServ.addMovieToSubscription(memberWithMovie));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = req.body;
    res.json(await subscriptionServ.updateSub(id, subscription));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await subscriptionServ.deleteSubscription(id));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

module.exports = router;
