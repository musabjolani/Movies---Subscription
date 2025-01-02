const moongose = require("mongoose");

const movieScema = moongose.Schema(
  {
    name: { type: String, required: true },
    genres: [String],
    image: String,
    premiered: Date,
  },
  { versionKey: false }
);

const Movie = moongose.model("Movie", movieScema);

module.exports = Movie;
