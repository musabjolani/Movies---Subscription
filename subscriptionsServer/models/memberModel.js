const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

membersSchema = moongose.Schema(
  { name: { type: String, required: true }, email: String, city: String },
  { versionKey: false }
);

const Member = mongoose.model("Member", membersSchema);

module.exports = Member;
