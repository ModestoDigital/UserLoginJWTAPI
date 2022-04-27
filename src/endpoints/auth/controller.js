"use strict";
const Company = require("../../Models/companyProfile");
const User = require("../../Models/User");
const Member = require("../../Models/memberProfile");
const Team = require("../../Models/team");
const Pipeline = require("../../Models/pipeline");
const Stage = require("../../Models/stage");
const stageBuilder = require("../../Models/stageBuilder");
const db = require("../../../db");
const util = require("../../Util/index");
const { message } = require("statuses");
const Exceptions = require("../../exceptions/Exception");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//functions

//login
const login = async (req, res) => {
  try {
    const data = req.body;
    const userExists = await util.checkEmailExists(data.email);
    if (!userExists || userExists.active === false) {
      throw new Exceptions.HTTP401Error("INCORRECT EMAIL OR PASSWORD");
    }
    const token = await util.tokenCreator(
      userExists.userUID,
      userExists.position,
      userExists.companyID,
      db.key,
      "600s"
    );
    const refrhToken = await util.tokenCreator(
      userExists.userUID,
      userExists.position,
      userExists.companyID,
      db.refkey,
      "1y"
    );
    bcrypt.compare(data.password, userExists.password, (err, passLogin) => {
      if (err) {
        console.log(err);
        throw new Exceptions.HTTP500Error("INTERNAL ERROR");
      }
      //token generation
      if (passLogin) {
        return res.status(200).json({
          msg: "AUTHORIZATION SUCCESSFUL",
          token: token,
          refreshToken: refrhToken,
        });
      }
      if (!passLogin) {
        throw new Exceptions.HTTP401Error("INCORRECT EMAIL OR PASSWORD");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

//Registra novo usuário e empresa.
const register = async (req, res) => {
  try {
    const data = req.body;

    if (!data.email || !data.password || !data.name || !data.cnpj) {
      throw new Exceptions.HTTP400Error("INCOMPLETE OR INSUFICIENT DATA");
    }

    const userExists = await util.checkEmailExists(data.email);
    const companyExists = await util.checkCopanyExists(data.cnpj);

    if (userExists) {
      //check user exists
      throw new Exceptions.HTTP422Error("EMAIL ALREADY IN USE");
    }

    if (companyExists) {
      throw new Exceptions.HTTP422Error("THIS COMPANY IS ALREADY REGISTERED");
    }

    const company = new Company(
      {
        cnpj: data.cnpj,
        phone: data.phone,
        email: data.email,
        segment: data.segment,
        teamSize: data.teamSize,
        goal: data.goal,
      },
      { strict: false }
    );

    //password hash
    let password;
    try {
      password = await bcrypt.hash(data.password, 10);
    } catch (error) {
      console.log(error);
      throw new Exceptions.HTTP500Error("INTERNAL ERROR");
    }

    const user = new User({
      email: data.email,
      companyID: company._id,
      position: "manager",
      password: password,
      active: false,
    });

    const teamManager = new Team({
      companyID: company._id,
      label: "Gestão",
      name: "manager",
      userUID: user._id,
    });
    const teamSeller = new Team({
      companyID: company._id,
      label: "Vendas",
      name: "seller",
      userUID: user._id,
    });
    const teamPreSeller = new Team({
      companyID: company._id,
      label: "Pré-Vendas",
      name: "pre-seller",
      userUID: user._id,
    });

    const member = new Member({
      _id: user._id,
      userUID: user._id,
      email: data.email,
      companyID: company._id,
      name: data.name,
      position: "manager",
      teamID: teamManager._id,
      phone: data.phone,
      secondPhone: data.secondPhone,
      active: false,
    });

    company.userUID = user._id;
    company.responsible = user._id;
    company.companyID = company._id;
    user.userUID = user._id;

    const pipeline = new Pipeline({
      companyID: company._id,
      description: "Funil Padrão",
      isDefault: true,
      userUID: user._id,
    });

    const baseStages = stageBuilder.baseStages(
      company._id,
      pipeline._id,
      user._id
    );

    try {
      company.save();
      user.save();
      teamManager.save();
      teamPreSeller.save();
      teamSeller.save();
      pipeline.save();
      Stage.insertMany(baseStages);
      await member.save();
      res.status(201).json({ msg: "REGISTRATION SUCCESSFULL" });
    } catch (error) {
      try {
        company.remove();
        user.remove();
        teamManager.remove();
        teamPreSeller.remove();
        teamSeller.remove();
        member.remove();
      } catch {
        console.log(error);
        throw new Exceptions.HTTP500Error("CASCADE ERROR: CONTACT YOU DBA");
      }
      console.log(error);
      throw new Exceptions.HTTP500Error("REGISTRATION ERROR");
    }
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

const refreshToken = async (req, res) => {
  const refToken = req.body.refreshToken;
  try {
    const user = jwt.verify(refToken, db.refkey);
    const newToken = await util.tokenCreator(
      user.userUID,
      user.position,
      user.companyID,
      db.key,
      "2h"
    );
    return res.status(200).json({
      msg: "AUTHORIZATION SUCCESSFUL",
      token: newToken,
    });
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

//Export
module.exports = {
  register,
  login,
  refreshToken,
};
