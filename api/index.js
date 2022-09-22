const router = require("../global/sysRoute");
const login = require("./routes/login");
const reg_customer = require("./routes/customer");
const ticket = require("./routes/ticket");
const customer = require("./routes/customer");
router.use(ticket);
router.use(login);
router.use(customer);

module.exports = router;
