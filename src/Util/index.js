const User = require("../Models/User");
const Member = require("../Models/memberProfile");
const Company = require("../Models/companyProfile.js");
const Pipeline = require("../Models/pipeline");
const Team = require("../Models/team");
const Stage = require("../Models/stage");
const jwt = require("jsonwebtoken");
const { key, refkey } = require("../../db");
const { ObjectId } = require("mongodb");
const { default: mongoose } = require("mongoose");

const checkEmailExists = async (email) => {
  try {
    const emailExists = User.findOne({ email: email });
    return emailExists;
  } catch (error) {
    throw new Exceptions.HTTP500Error("INTERNAL ERROR");
  }
};

const checkUserExists = async (userUID) => {
  try {
    const userExists = Member.findOne({ userUID: userUID });
    return userExists;
  } catch (error) {
    throw new Exceptions.HTTP500Error("INTERNAL ERROR");
  }
};

const getMemberProfileByID = async (userUID) => {
  return checkUserExists(userUID);
};

const checkCopanyExists = async (cnpj) => {
  try {
    const companyExists = Company.findOne({ cnpj: cnpj });
    return companyExists;
  } catch (error) {
    throw new Exceptions.HTTP500Error("INTERNAL ERROR");
  }
};

const findTeamID = async (companyID, position) => {
  try {
    return await Team.findOne({ companyID: companyID, name: position }).select(
      "teamID"
    );
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

const authRefreshToken = (req, res, next) => {
  try {
    const refreshToken = req.headers.refreshToken;
    if (!refreshToken) {
      throw res.status(403).send("NO REFRESHTOKEN PROVIDED!");
    }
    if (isTokenExpired(refreshToken)) {
      throw res.status(403).send("REFRESHTOKEN EXPIRED");
    }

    const decoded = jwt.verify(refreshToken, refkey);
    req.userdata = decoded;
    next();
  } catch (error) {
    console.log(error.name);
    throw res.sendStatus(403).json({ msg: "FORBIDDEN: INVALID REFRESHTOKEN" });
  }
};

const authToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    throw res.status(403).send("NO TOKEN PROVIDED!");
  }
  if (isTokenExpired(token)) {
    throw res.status(403).send("TOKEN EXPIRED");
  }
  try {
    const decoded = jwt.verify(token, key);

    req.userdata = decoded;
    next();
  } catch (error) {
    console.log(error.name);
    throw res.sendStatus(403).json({ msg: "FORBIDDEN: INVALID TOKEN" });
  }
};

function isTokenExpired(token) {
  const payloadBase64 = token.split(".")[1];
  const decodedJson = Buffer.from(payloadBase64, "base64").toString();
  const decoded = JSON.parse(decodedJson);
  const exp = decoded.exp;
  return Date.now() >= exp * 1000;
}

const tokenCreator = async (userUID, position, companyID, key, time) => {
  return jwt.sign(
    {
      userUID: userUID,
      position: position,
      companyID: companyID,
    },
    key,
    {
      expiresIn: time,
    }
  );
};

const checkPipeline = async (pipelineID) => {
  try {
    if (pipelineID.match(/^[0-9a-fA-F]{24}$/)) {
      return await Pipeline.findById(pipelineID).exec();
    } else {
      return await Pipeline.findOne({ id: pipelineID }).exec();
    }
  } catch (error) {
    console.log(error);
    throw new Exceptions.HTTP500Error("INTERNAL ERROR");
  }
};

const checkStage = async (stageID) => {
  try {
    if (stageID.match(/^[0-9a-fA-F]{24}$/)) {
      return await Stage.findById(stageID).exec();
    } else {
      return await Stage.findOne({ id: stageID }).exec();
    }
  } catch (error) {
    console.log(error);
    throw new Exceptions.HTTP500Error("INTERNAL ERROR");
  }
};

module.exports = {
  checkEmailExists,
  checkUserExists,
  getMemberProfileByID,
  checkCopanyExists,
  authToken,
  tokenCreator,
  authRefreshToken,
  findTeamID,
  checkPipeline,
  checkStage,
};
