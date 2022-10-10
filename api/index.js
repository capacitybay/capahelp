const { router } = require('../utils/packages');
const login = require('./routes/login');
const ticket = require('./routes/ticket');
const user = require('./routes/user');
const department = require('./routes/department');
const resetPassword = require('./routes/resetPassword');
const manageAgentDept = require('./routes/manageAgentDepartment');
const refresh = require('./routes/refresh');
router.use(ticket);
router.use(login);
router.use(user);
router.use(department);
router.use(resetPassword);
router.use(resetPassword);
router.use(manageAgentDept);
router.use(refresh);

module.exports = router;
