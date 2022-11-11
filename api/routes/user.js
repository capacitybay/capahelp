const { router } = require('../../utils/packages');
const {
  createUser,
  getUser,
  updateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
  adminCreateUser,
} = require('../controllers');
const authenticateToken = require('../../auth/authenticateToken');
const {
  forwardAuthenticated,
  ensureAuthenticated,
  isAdmin,
} = require('../../middleware/auth');
router.get('/user/register', (req, res) => {
  return res.render('register', {
    message: null,
    email: null,
  });
  // return
});
router.post('/user/register', createUser);
// solutions
router.get('/user/solution', (req, res) => {
  res.render('User/solutions.ejs');
});
router.get('/admin/dashboard', isAdmin, (req, res) => {
  res.render('Admin/adminDashboard.ejs');
});
// admin route
router.post('/user/create', adminCreateUser);

// gets all user (admin route)
router.get('/user/list', authenticateToken, getUser);

// gets a user(admin route)
router.get('/user/view/:userId', authenticateToken, viewUser);

// update a user (admin route)
router.patch('/user/update/:userId', authenticateToken, updateUser);
// delete a user
router.delete('/user/delete/:userId', authenticateToken, deleteUser);
router.put('/user/deactivate/:userId', authenticateToken, deactivateUser);
router.put('/user/reactivate/:userId', authenticateToken, reactivateUser);

module.exports = router;
/**
 *
 */
