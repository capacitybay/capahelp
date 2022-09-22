const router = require("express").Router();
const login = require("./routes/login");
const reg_customer = require("./routes/reg_customer");
router.use(login);
router.use(reg_customer);

module.exports = router;
