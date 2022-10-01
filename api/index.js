const router = require("../utils/sysRoute");
const login = require("./routes/login");
const ticket = require("./routes/ticket");
const user = require("./routes/user");
const department = require("./routes/department");
const resetPassword = require("./routes/resetPassword");
router.use(ticket);
router.use(login);
router.use(user);
router.use(department);
router.use(resetPassword);

module.exports = router;
