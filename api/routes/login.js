const router = require("express").Router();

const { loginController } = require("../controllers/loginController");

router.get("/login", loginController);

module.exports = router;
