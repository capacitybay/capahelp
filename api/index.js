const router = require("../global/sysRoute");
const login = require("./routes/login");
const ticket = require("./routes/ticket");
const user = require("./routes/user");
const department = require("./routes/department");
router.use(ticket);
router.use(login);
router.use(user);
router.use(department);

module.exports = router;
