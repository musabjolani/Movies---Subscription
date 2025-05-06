const Member = require("../models/memberModel");
const Movie = require("../models/movieModel");
const Subscription = require("../models/subscriptionModel");
const utils = require("../Utils/utils");

const getAllSubscriptions = async () => {
  return await Subscription.find().populate("member").populate("movies");
};
const getSubscriptionByID = async (id) => {
  if (utils.isIDValid(id)) return await Subscription.findById(id);
  return [];
};

const getUnsubscribedMovies = async (memberId) => {
  try {
    const subscription = await Subscription.findOne({ memberId });

    const subscribedMovieIds = subscription
      ? subscription.movies.map((movie) => movie.movieId)
      : [];

    const unsubscribedMovies = await Movie.find({
      _id: { $nin: subscribedMovieIds },
    }).sort({ name: 1 }); // Sort by name ASC

    return unsubscribedMovies;
  } catch (error) {
    console.error("Error fetching unsubscribed movies:", error.message);
    throw error;
  }
};

//With Maps
// const getAllMembersWithMovies = async () => {
//   try {
//     // Fetch all members
//     const { data: members } = await getAll(`/members`);

//     // Fetch movies for all members in parallel using Promise.all
//     const membersWithMovies = await Promise.all(
//       members.map(async (member) => {
//         const { data: subscriptions } = await getAll(
//           `/subscriptions/member/${member._id}`
//         );

//         const movies = subscriptions
//           ? subscriptions.flatMap((sub) =>
//               sub.movies.map((movie) => ({
//                 movieId: movie.movieId,
//                 date: movie.date,
//               }))
//             )
//           : [];

//         return {
//           ...member,
//           movies,
//         };
//       })
//     );

//     // Update state after all API calls are completed
//     setMembers(membersWithMovies);
//   } catch (error) {
//     console.log(error);
//   }
// };

const getAllMembersWithMovies = async () => {
  try {
    const members = await Member.aggregate([
      // 1. Lookup subscriptions
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "memberId",
          as: "subscriptions",
        },
      },
      // 2. Unwind subscriptions array (optional: preserve if no subscription)
      {
        $unwind: {
          path: "$subscriptions",
          preserveNullAndEmptyArrays: true,
        },
      },
      // 3. Lookup movies from Movie collection
      {
        $lookup: {
          from: "movies",
          localField: "subscriptions.movies.movieId",
          foreignField: "_id",
          as: "movies",
        },
      },
      // 4. Project the final structure
      {
        $project: {
          _id: 0, // hide internal _id if you want
          subscriptionId: "$subscriptions._id",
          memberId: "$_id",
          name: 1,
          email: 1,
          city: 1,
          movies: {
            $map: {
              input: "$movies",
              as: "movie",
              in: {
                _id: "$$movie._id",
                name: "$$movie.name",
                genres: "$$movie.genres",
                image: "$$movie.image",
                premiered: "$$movie.premiered",
              },
            },
          },
        },
      },
    ]);

    return members;
  } catch (error) {
    console.error("error");
    return [];
  }
};

const getAllMoviesWithMembers = async () => {
  try {
    const movies = await Movie.aggregate([
      {
        $lookup: {
          from: "subscriptions",
          let: { movieId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$movieId", "$movies.movieId"],
                },
              },
            },
            {
              $lookup: {
                from: "members",
                localField: "memberId",
                foreignField: "_id",
                as: "memberDetails",
              },
            },
            {
              $unwind: "$memberDetails",
            },
            {
              $project: {
                _id: 0,
                memberId: "$memberDetails._id",
                name: "$memberDetails.name",
                email: "$memberDetails.email",
                city: "$memberDetails.city",
              },
            },
          ],
          as: "subscribedMembers",
        },
      },
      {
        $addFields: {
          subscribersCount: { $size: "$subscribedMembers" },
        },
      },
      {
        $sort: { subscribersCount: -1 },
      },
      {
        $project: {
          subscribersCount: 0, // Optional: remove count field from final output
        },
      },
    ]);

    return movies;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const getSubscriptionByMember = async (memberId) => {
  return await Subscription.findOne({ memberId: memberId });
};

const getMoviesByMember = async (memberId) => {
  return await Subscription.find({ memberId: memberId })
    .populate("movies.movieId")
    .lean();
};
const getMembersByMovies = async (movieId) => {
  return await Subscription.find({
    "movies.movieId": movieId,
  }).populate("memberId");
};

const addSubscription = async (subscription) => {
  const newSubscription = new Subscription(subscription);
  await newSubscription.save();
  return "Subscription Added";
};

const updateSubscription = async (id, subscription) => {
  await Subscription.findByIdAndUpdate(id, subscription);
  return "Subscription Updated";
};

const deleteMoviesFromSubscription = async (movieIdToRemove) => {
  await Subscription.updateMany(
    {},
    {
      $pull: {
        movies: { movieId: movieIdToRemove }, // movieIdToRemove is an ObjectId
      },
    }
  );
  return "All Movies are deleted from the Subscriptions";
};

const deleteSubscription = async (id) => {
  await Subscription.findByIdAndDelete(id);
  return "Subscription Deleted";
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionByID,
  getMoviesByMember,
  getSubscriptionByMember,
  getAllMoviesWithMembers,
  getAllMembersWithMovies,
  getUnsubscribedMovies,
  addSubscription,
  updateSubscription,
  deleteMoviesFromSubscription,
  deleteSubscription,
};
