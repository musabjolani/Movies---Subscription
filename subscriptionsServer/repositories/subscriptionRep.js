const Subscription = require("../models/subscriptionModel");
const utils = require("../Utils/utils");

const getAllSubscriptions = async () => {
  return await Subscription.find().populate("movie");
};
const getSubscriptionByID = async (id) => {
  if (utils.isIDValid(id)) return await Subscription.findById(id);
  return [];
};
const getMoviesByMember = async (memberId) => {
  return await Subscription.find({ memberId: memberId }).populate(
    "movies.movieId"
  );
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
  getMembersByMovies,
  addSubscription,
  updateSubscription,
  deleteSubscription,
};
