const { router } = require('../../utils/packages');
const authenticateToken = require('../../auth/authenticateToken');
const {
  createDepartment,
  getDepartment,
  // viewDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
  removeAgentFromDepartment,
  deactivateDepartment,
  reactivateDepartment,
} = require('../controllers');

const { isAdmin } = require('../../middleware/auth');
router.get('/admin/manage/department', isAdmin, getDepartment);
// router.get('/admin/view/department', isAdmin, viewDepartment);
// router.get('/admin/department/list', (req, res) => {
//   res.render('Admin/departments');
// });
router.post('/department/create', authenticateToken, createDepartment);
router.patch('/department/update/:deptId', authenticateToken, updateDepartment);
router.patch(
  '/admin/deactivate/department/:deptId',
  isAdmin,
  deactivateDepartment
);
router.patch(
  '/admin/reactivate/department/:deptId',
  isAdmin,
  reactivateDepartment
);
router.delete(
  '/department/delete/:deptId',
  authenticateToken,
  deleteDepartment
);
router.get('/footer', (req, res) => {
  res.render('partials/footer');
});
router.get('/admin/view/department/:deptId', isAdmin, viewDepartment);
router.put(
  '/department/remove_agent/:deptId',
  authenticateToken,
  removeAgentFromDepartment
);

module.exports = router;
