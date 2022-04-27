const { Router } = require("express");
const router = Router();
const controller = require("./controller");

//Routes

router.post("/register", controller.register);

router.post("/login", controller.login);

router.post("/refreshToken", controller.refreshToken);

//export modules

module.exports = router;
