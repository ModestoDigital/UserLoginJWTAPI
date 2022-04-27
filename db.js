const mongoose = require("mongoose");
require("dotenv/config");

const vendeeback = process.env.DB_vendeeback;
const prod = process.env.DB_prod;
const key = process.env.TOKEN_Secret_Key;
const refkey = process.env.REFR_SECREC_KEY;

const connect = async () => {
  await mongoose
    .connect(vendeeback, { useNewUrlParser: true })
    .then(() => {
      console.log("Connected to db");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  connect,
  key,
  refkey,
};
