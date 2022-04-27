const mongoose = require("mongoose");

const MemberSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  userUID: {
    type: String,
    required: true,
  },
  teamID: {
    type: String,
    required: true,
  },
  companyID: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  secondPhone: {
    type: String,
    required: false,
  },
  position: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
  },
  urlImage: {
    type: String,
    required: false,
  },
  created: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("memberProfile", MemberSchema);
