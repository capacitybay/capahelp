const router = require("express").Router();

const { loginController } = require("../controllers");
// console.log(loginController);

router.get("/login", loginController);

module.exports = router;
