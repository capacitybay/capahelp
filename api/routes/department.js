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

const { isAdmin } = require('../../middleware/auth');
router.get('/admin/manage/department', isAdmin, getDepartment);
// router.get('/admin/department/list', (req, res) => {
//   res.render('Admin/departments');
// });
router.post('/department/create', authenticateToken, createDepartment);
router.patch('/department/update/:deptId', authenticateToken, updateDepartment);
router.delete(
  '/department/delete/:deptId',
  authenticateToken,
  deleteDepartment
);
router.get('/footer', (req, res) => {
  res.render('partials/footer');
});
router.get('/department/view/:deptId', authenticateToken, viewDepartment);
router.put(
  '/department/remove_agent/:deptId',
  authenticateToken,
  removeAgentFromDepartment
);

module.exports = router;
