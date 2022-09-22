const router = require("express").Router();
const login = require("./routes/login");

router.use(login);

module.exports = router;
