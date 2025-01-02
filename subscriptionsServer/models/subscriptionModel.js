const mongoose = require("mongoose");

const subscriptionSchems = mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
    },
    movies: [
      {
        movieId: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
        date: { type: Date, default: Date.now },
      },
    ],
  },
  { versionKey: false }
);

const Subscription = mongoose.model("Subscription", subscriptionSchems);

module.exports = Subscription;
