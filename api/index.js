const router = require("../global/sysRoute");
const login = require("./routes/login");
const ticket = require("./routes/ticket");
const user = require("./routes/user");
router.use(ticket);
router.use(login);
router.use(user);

module.exports = router;
