const movieRsp = require("../repositories/movieRep");

const getAllMovies = () => {
  return movieRsp.getAllMovies();
};
const getMovieByID = (id) => {
  return movieRsp.getMovieByID(id);
};

const getMoviesWS = async () => {
  return movieRsp.getMoviesWS();
};
const addMovie = (movie) => {
  return movieRsp.addMovie(movie);
};

const updateMovie = (id, movie) => {
  return movieRsp.updateMovie(id, movie);
};

const deleteMovie = (id) => {
  return movieRsp.deleteMovie(id);
};

module.exports = {
  getAllMovies,
  getMovieByID,
  getMoviesWS,
  addMovie,
  updateMovie,
  deleteMovie,
};
