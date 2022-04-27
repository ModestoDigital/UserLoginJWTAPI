const mongoose = require("mongoose");

const teamSchema = mongoose.Schema({
  companyID: {
    type: String,
    required: true,
  },
  userUID: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
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

module.exports = mongoose.model("team", teamSchema);
