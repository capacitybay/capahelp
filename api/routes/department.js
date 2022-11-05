const { router } = require('../../utils/packages');
const authenticateToken = require('../../auth/authenticateToken');
const {
  createDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
  removeAgentFromDepartment,
} = require('../controllers');

router.get('/department/list', authenticateToken, getDepartment);
router.post('/department/create', authenticateToken, createDepartment);
router.patch('/department/update/:deptId', authenticateToken, updateDepartment);
router.delete(
  '/department/delete/:deptId',
  authenticateToken,
  deleteDepartment
);
router.get('/department/view/:deptId', authenticateToken, viewDepartment);
router.put(
  '/department/remove_agent/:deptId',
  authenticateToken,
  removeAgentFromDepartment
);

module.exports = router;
