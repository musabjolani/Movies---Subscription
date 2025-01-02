const memberRep = require("../repositories/memberRep");

const getAllMembers = () => {
  return memberRep.getAllMembers();
};
const getMemberByID = (id) => {
  return memberRep.getMemberByID(id);
};
const getMembersWS = async () => {
  return memberRep.getMembersWS();
};
const addMember = (memeber) => {
  return memberRep.addMember(memeber);
};
const updateMember = (id, member) => {
  return memberRep.updateMember(id, member);
};

const deleteMember = async (id) => {
  return memberRep.deleteMember(id);
};

module.exports = {
  addMember,
  getAllMembers,
  getMemberByID,
  getMembersWS,
  updateMember,
  deleteMember,
};
