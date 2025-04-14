const subscriptionRep = require("../repositories/subscriptionRep");

const getAllSubscriptions = () => {
  return subscriptionRep.getAllSubscriptions();
};

const getSubscriptionByID = (id) => {
  return subscriptionRep.getSubscriptionByID(id);
};

const getAllMembersWithMovies = () => {
  return subscriptionRep.getAllMembersWithMovies();
};
const getAllMoviesWithMembers = () => {
  return subscriptionRep.getAllMoviesWithMembers();
};

const getMoviesByMember = async (memberId) => {
  const memberSubscriptions = (
    await subscriptionRep.getMoviesByMember(memberId)
  )[0];

  if (!memberSubscriptions) return [];

  if (memberSubscriptions && memberSubscriptions.toObject) {
    memberSubscriptions = memberSubscriptions.toObject();
  }

  return {
    ...memberSubscriptions,
    movies: memberSubscriptions.movies.map((movie) => {
      return {
        id: movie.movieId._id,
        name: movie.movieId.name,
        date: movie.date,
      };
    }),
  };
};
const getMembersByMovies = async (movieId) => {
  const subscriptions = await subscriptionRep.getMembersByMovies(movieId);

  return subscriptions.map((subscription) => {
    const memberDetails = {
      name: subscription.memberId.name,
      date: subscription.movies.find(
        (movie) => movie.movieId.toString() === movieId
      )?.date,
    };

    return memberDetails;
  });
};

const addSubscription = (subscription) => {
  return subscriptionRep.addSubscription(subscription);
};
/*  
memberWithMovie:{
  subscriptionId:"",
  memberid:"",
  movie:{
    movieId :"",
    date :"1/1/2025"
  }
}*/
const addMovieToSubscription = async (memberWithMovie) => {
  try {
    //  Fetch existing subscription (should return an object, not an array)
    let subscription = await subscriptionRep.getSubscriptionByMember(
      memberWithMovie.memberId
    );

    //  If no subscription exists, create a new one
    if (!subscription) {
      const newSubscription = {
        memberId: memberWithMovie.memberId,
        movies: [
          {
            movieId: memberWithMovie.movie.movieId,
            date: memberWithMovie.movie.date,
          },
        ],
      };
      return await addSubscription(newSubscription); //  Use `await`
    }

    //  Use Mongoose `$push` to add the movie efficiently
    return await updateSubscription(subscription._id, {
      $push: {
        movies: {
          movieId: memberWithMovie.movie.movieId,
          date: memberWithMovie.movie.date,
        },
      },
    });
  } catch (error) {
    console.error("Error in addMovieToSubscription:", error);
    throw new Error("Failed to add movie to subscription " + error);
  }
};

const updateSubscription = (id, subscription) => {
  return subscriptionRep.updateSubscription(id, subscription);
};

const deleteSubscription = (id) => {
  return subscriptionRep.deleteSubscription(id);
};

const deleteMoviesFromSubscription = (moveiId) => {
  return subscriptionRep.deleteMoviesFromSubscription(moveiId);
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionByID,
  getMoviesByMember,
  getMembersByMovies,
  getAllMembersWithMovies,
  getAllMoviesWithMembers,
  addSubscription,
  addMovieToSubscription,
  updateSubscription,
  deleteMoviesFromSubscription,
  deleteSubscription,
};
