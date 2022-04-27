const { Router } = require("express");
const router = Router();
const controller = require("./controller");
const { authToken } = require("../../Util/index");

//Routes

router.get("/getUserProfile/", authToken, controller.getUserProfile);

router.get("/getUserMe/", authToken, controller.getUserMe);

router.get(
  "/getMemberProfile/:user_id",
  authToken,
  controller.getMemberProfile
);

router.get(
  "/getMemberByTeamPosition/",
  authToken,
  controller.getMemberByTeamPosition
);

router.post("/postMemberProfile", authToken, controller.postMemberProfile);

router.put("/putMemberProfile", authToken, controller.putMemberProfile);

router.delete(
  "/deleteMemberProfile",
  authToken,
  controller.deleteMemberProfile
);

//export modules

module.exports = router;
