const express = require("express");
const movieServ = require("../services/movieServ");
const { permissionMiddleware } = require("../middleware/permissionMiddleware ");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json(await movieServ.getAllMovies());
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await movieServ.getMovieByID(id));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.post("/", async (req, res) => {
  try {
    const movie = req.body;
    res.json(await movieServ.addMovie(movie));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.post("/copyMoviessWsToDB", async (req, res) => {
  try {
    const { data } = await movieServ.getMoviesWS();
    data.map(async (movie) => {
      await movieServ.addMovie({
        name: movie.name,
        genres: movie.genres,
        image: movie.image.medium,
        premiered: movie.premiered,
      });
    });
    res.json("done");
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const movie = req.body;
    res.json(await movieServ.updateMovie(id, movie));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await movieServ.deleteMovie(id));
  } catch (error) {
    res.json(res.status(404).json(error.message));
  }
});

module.exports = router;
