const axios = require("axios");
const Movie = require("../models/movieModel");
const MovieWSURL = "https://api.tvmaze.com/shows";

const getAllMovies = async () => {
  return await Movie.find();
};
const getMovieByID = async (id) => {
  return await Movie.findById(id);
};

const getMoviesWS = async () => {
  return await axios.get(MovieWSURL);
};
const addMovie = async (movie) => {
  const newMovie = new Movie(movie);
  await newMovie.save();
  return "Movie Added";
};

const updateMovie = async (id, movie) => {
  await Movie.findByIdAndUpdate(id, movie);
  return "Movie Updated";
};

const deleteMovie = async (id) => {
  await Movie.findByIdAndDelete(id);
  return "Movie deleted";
};

module.exports = {
  getAllMovies,
  getMovieByID,
  getMoviesWS,
  addMovie,
  updateMovie,
  deleteMovie,
};
