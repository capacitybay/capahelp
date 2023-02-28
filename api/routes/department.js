const { router } = require('../../utils/packages');
const authenticateToken = require('../../auth/authenticateToken');
const {
  createDepartment,
  getDepartment,
  getCreateDepartment,
  deleteDepartment,
  adminUpdateDepartment,
  adminViewDepartment,
  removeAgentFromDepartment,
  deactivateDepartment,
  reactivateDepartment,
  getUpdateDepartment,
  filterDepartments,
  getFilterDepartments,
} = require('../controllers');

const { isAdmin, ensureAuthenticated } = require('../../middleware/auth');
router.get('/admin/manage/department', isAdmin, getDepartment);

router.get('/admin/create/department', isAdmin, getCreateDepartment);
router.post('/admin/create/department', isAdmin, createDepartment);
router.post('/admin/update/department/:deptId', isAdmin, adminUpdateDepartment);
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
router.get('/admin/view/department/:deptId', isAdmin, adminViewDepartment);
router.put('/department/remove/agent', isAdmin, removeAgentFromDepartment);

module.exports = router;
