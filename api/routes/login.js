const router = require("express").Router();
const { loginController } = require("../controllers");
// console.log(loginController);

router.post("/login", loginController);

module.exports = router;
