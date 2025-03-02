const Member = require("../models/memberModel");
const Subscription = require("../models/subscriptionModel");
const utils = require("../Utils/utils");

const getAllSubscriptions = async () => {
  return await Subscription.find().populate("member").populate("movies");
};
const getSubscriptionByID = async (id) => {
  if (utils.isIDValid(id)) return await Subscription.findById(id);
  return [];
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
      {
        $lookup: {
          from: "subscriptions", // Collection name in MongoDB
          localField: "_id",
          foreignField: "memberId",
          as: "subscriptions",
        },
      },
      {
        $unwind: {
          path: "$subscriptions",
          preserveNullAndEmptyArrays: true, // Keep members even if they have no subscriptions
        },
      },
      {
        $lookup: {
          from: "movies",
          localField: "subscriptions.movies.movieId",
          foreignField: "_id",
          as: "movies",
        },
      },
      {
        $project: {
          _id: 1,
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
const deleteSubscription = async (id) => {
  await Subscription.findByIdAndDelete(id);
  return "Subscription Deleted";
};

module.exports = {
  getAllSubscriptions,
  getSubscriptionByID,
  getMoviesByMember,
  getSubscriptionByMember,
  getMembersByMovies,
  getAllMembersWithMovies,
  addSubscription,
  updateSubscription,
  deleteSubscription,
};
