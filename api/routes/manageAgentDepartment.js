const { router } = require('../../utils/packages');
const { addAgentToDept } = require('../controllers');
const authenticateToken = require('../../auth/authenticateToken');
router.post('/department/add/agent/:deptId', addAgentToDept);

module.exports = router;
