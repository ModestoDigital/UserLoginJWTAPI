const mongoose = require("mongoose");

const companySchema = mongoose.Schema({
  companyID: {
    type: String,
    required: true,
  },
  userUID: {
    type: String,
    required: true,
  },
  cnpj: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: false,
  },
  tradeName: {
    type: String,
    required: false,
  },
  responsible: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  number: {
    type: String,
    required: false,
  },
  complement: {
    type: String,
    required: false,
  },
  neighborhood: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  site: {
    type: String,
    required: false,
  },
  secundaryPhone: {
    type: String,
    required: false,
  },
  segment: {
    type: String,
    required: false,
  },
  teamSize: {
    type: String,
    required: false,
  },
  goal: {
    type: String,
    required: false,
  },
  active: {
    type: Boolean,
    required: true,
    default: false,
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

module.exports = mongoose.model("companyProfile", companySchema);
