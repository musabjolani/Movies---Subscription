const Member = require("../models/memberModel");
const axios = require("axios");
const MemberWSURL = "https://jsonplaceholder.typicode.com/users";

const getAllMembers = async () => {
  return await Member.find();
};
const getMemberByID = async (id) => {
  return await Member.findById(id);
};

const getMembersWS = async () => {
  return await axios.get(MemberWSURL);
};

const addMember = async (member) => {
  const newMember = new Member(member);
  await newMember.save();
  return "Member Added";
};

const updateMember = async (id, member) => {
  await Member.findByIdAndUpdate(id, member);
  return "Member Updated";
};
const deleteMember = async (id) => {
  await Member.findByIdAndDelete(id);
  return "Member deleted";
};

module.exports = {
  getAllMembers,
  getMemberByID,
  getMembersWS,
  addMember,
  updateMember,
  deleteMember,
};
