const subscriptionRep = require("../repositories/subscriptionRep");

const getAllSubscriptions = () => {
  return subscriptionRep.getAllSubscriptions();
};

const getSubscriptionByID = (id) => {
  return subscriptionRep.getSubscriptionByID(id);
};

const getMoviesByMember = async (memberId) => {
  const memberSubscriptions = await subscriptionRep.getMoviesByMember(memberId);

  return memberSubscriptions.map((subscription) => {
    return {
      movies: subscription.movies.map((movie) => {
        return { name: movie.movieId.name, date: movie.date };
      }),
    };
  });
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
  const subscription = await getSubscriptionByID(
    memberWithMovie.subscriptionId
  );

  // If the subscription doesn't exist or is empty, create a new one
  if (!subscription || Object.keys(subscription).length === 0) {
    const newSubscription = {
      memberId: memberWithMovie.memberId,
      movies: [
        {
          movieId: memberWithMovie.movie.movieId,
          date: memberWithMovie.movie.date,
        },
      ],
    };
    return addSubscription(newSubscription);
  }

  // Add the movie to the existing subscription
  subscription.movies.push({
    movieId: memberWithMovie.movie.movieId,
    date: memberWithMovie.movie.date,
  });

  return updateSubscription(memberWithMovie.subscriptionId, subscription);
};

const updateSubscription = (id, subscription) => {
  return subscriptionRep.updateSubscription(id, subscription);
};

const deleteSubscription = (id) => {
  return subscriptionRep.deleteSubscription(id);
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionByID,
  getMoviesByMember,
  getMembersByMovies,
  addSubscription,
  addMovieToSubscription,
  updateSubscription,
  deleteSubscription,
};
