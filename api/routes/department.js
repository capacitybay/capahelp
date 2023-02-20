const { router } = require('../../utils/packages');
const authenticateToken = require('../../auth/authenticateToken');
const {
  createDepartment,
  getDepartment,
  getCreateDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
  removeAgentFromDepartment,
  deactivateDepartment,
  reactivateDepartment,
  getUpdateDepartment,
  filterDepartments,
  getFilterDepartments,
} = require('../controllers');

const { isAdmin, ensureAuthenticated } = require('../../middleware/auth');
router.get('/admin/manage/department', isAdmin, getDepartment);
// router.get('/admin/view/department', isAdmin, viewDepartment);
// router.get('/admin/department/list', (req, res) => {
//   res.render('Admin/departments');
// });
router.get('/admin/create/department', isAdmin, getCreateDepartment);
router.post('/admin/create/department', isAdmin, createDepartment);
router.post('/admin/update/department/:deptId', isAdmin, updateDepartment);
router.get('/admin/update/department/:deptId', isAdmin, getUpdateDepartment);
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
router.post('/admin/filter/departments', isAdmin, filterDepartments);
router.get('/admin/filter/departments', isAdmin, getFilterDepartments);
router.delete('/admin/delete/department/:deptId', isAdmin, deleteDepartment);
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
