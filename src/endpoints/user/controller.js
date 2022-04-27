"use strict";
const User = require("../../Models/User");
const Member = require("../../Models/memberProfile");
const Team = require("../../Models/team");
const Util = require("../../Util");
const Exceptions = require("../../exceptions/Exception");

//getUserProfile
const getUserProfile = async (req, res) => {
  //functions args
  const userUID = req.userdata.userUID;
  try {
    const user = await Util.getMemberProfileByID(userUID);
    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

//getUserMe
const getUserMe = async (req, res) => {
  //functions args
  const userUID = req.userdata.userUID;
  try {
    const user = await Util.getMemberProfileByID(userUID);
    res.status(200).json(user.position);
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

//getMemberProfile
const getMemberProfile = async (req, res) => {
  //functions args
  try {
    const id = req.params.user_id;
    const profile = await Util.getMemberProfileByID(id);
    if (!profile) {
      throw new Exceptions.HTTP404Error("USER NOT FOUND");
    }
    res.status(200).json(profile);
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

//getMemberByTeamPosition
const getMemberByTeamPosition = async (req, res) => {
  //functions args
  const listMembersByPositions = async (companyID, positions) => {
    try {
      let members = [];
      let teamsIds = [];

      if (positions) {
        const ids = await Team.find({
          companyID: companyID,
          name: { $in: positions },
        });

        ids.forEach((team) => {
          teamsIds.push(team._id);
        });
        console.log(teamsIds);
      }
      if (teamsIds && teamsIds.length) {
        members = await Member.find({
          companyID: companyID,
          teamID: { $in: teamsIds },
        });
      }
      return members;
    } catch (error) {
      throw new Exceptions.HTTP500Error(`Internal error: ${error}`);
    }
  };
  try {
    const companyID = req.userdata.companyID;
    const positions = req.query.positions.split(",");

    if (!companyID) {
      throw new Exceptions.HTTP400Error("COMPANY NOT FOUND");
    } else {
      const members = await listMembersByPositions(companyID, positions);
      return res.status(200).json(members);
    }
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

//postMemberProfile
const postMemberProfile = async (req, res) => {
  //functions args
  try {
    const userExists = await Util.checkEmailExists(req.body.email);

    const email = req.body.email;
    const companyID = req.userdata.companyID;
    const position = req.body.position;
    const name = req.body.name;
    const teamID = await Util.findTeamID(companyID, position);

    if (!email || !position || !name) {
      throw new Exceptions.HTTP400Error("Dados insuficientes para cadastro");
    }

    if (userExists) {
      //check user exists
      throw new Exceptions.HTTP422Error("EMAIL ALREADY IN USE");
    }
    const user = new User({
      email: email,
      companyID: companyID,
      position: position,
      active: false,
    });

    user.userUID = user._id;

    const member = new Member({
      _id: user._id,
      userUID: user._id,
      email: email,
      companyID: companyID,
      name: name,
      position: position,
      teamID: teamID,
      phone: req.body.phone,
      secondPhone: req.body.secondPhone,
      active: false,
    });

    try {
      await user.save();
      await member.save();
      res.status(201).json({ msg: "Usuário criado com sucesso" });
    } catch (error) {
      throw new Exceptions.HTTP500Error("Erro ao Cadastrar usuário");
    }
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

//putMemberProfile
const putMemberProfile = async (req, res) => {
  try {
    const userExists = await Util.checkUserExists(req.body.userUID);

    if (!req.body.userUID) {
      throw new Exceptions.HTTP400Error("Bad Request: Não há argumentos!");
    }

    if (!userExists) {
      throw new Exceptions.HTTP404Error("Usuário não encontrado");
    }

    let updateData = req.body;
    updateData.updated = Date.now();

    try {
      await Member.updateOne({ userUID: req.body.userUID }, updateData);
      res.status(200).json({ msg: "Usuário atualizado com sucesso" });
    } catch (error) {
      throw new Exceptions.HTTP500Error("Erro ao atualizar usuário");
    }
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

//deleteMemberProfile
const deleteMemberProfile = async (req, res) => {
  try {
    const json = req.body;

    const profileID = json.userUID;

    const userExists = await Util.checkUserExists(profileID);

    if (!userExists) {
      throw new Exceptions.HTTP404Error("Usuário não encontrado");
    }

    const itAuthorized =
      ["admin", "manager"].includes(req.userdata.position) &&
      userExists.companyID === req.userdata.companyID;

    if (!itAuthorized || profileID === req.userdata.userUID) {
      throw new Exceptions.HTTP401Error("Não autorizado");
    }
    await Member.deleteOne({ userUID: profileID });
    await User.deleteOne({ userUID: profileID });
    return res
      .status(200)
      .json({ message: "Informações do usuário deletadas com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(error.status).json(error.message);
  }
};

//Auxilary functions
//export
module.exports = {
  getUserProfile,
  getUserMe,
  getMemberProfile,
  getMemberByTeamPosition,
  postMemberProfile,
  putMemberProfile,
  deleteMemberProfile,
};
