const router = require("express").Router();

const { customerController } = require("../controllers");

router.post("/reg_customer", customerController);

module.exports = router;
