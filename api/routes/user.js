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
  adminDashboard,
  filterUsers,
} = require('../controllers');
const authenticateToken = require('../../auth/authenticateToken');

const {
  forwardAuthenticated,
  ensureAuthenticated,
  isAdmin,
} = require('../../middleware/auth');
const { render } = require('ejs');
const userModel = require('../../models/userModel');
router.get('/user/register', (req, res) => {
  return res.render('register', {
    message: null,
    email: null,
  });
  // return
});

router.get('/admin/register', (req, res) => {
  return res.render('Admin/adminCreateUser.ejs', {
    message: null,
    email: null,
  });
  // return
});
router.post('/user/register', createUser);
router.post('/filter/users', filterUsers);
// admin route
router.post('/admin/register', adminCreateUser);
router.get('/admin/register', (req, res) => {
  res.render('Admin/adminCreateUser');
});
router.get('/user/profile/edit', (req, res) => {
  res.render('User/editProfile');
});
// solutions
router.get('/user/solutions', (req, res) => {
  res.render('User/solutions.ejs');
});
// function get
router.get('/admin/dashboard', isAdmin, adminDashboard);
// admin route
// router.post('/user/create', adminCreateUser);

// gets all user (admin route)
router.get('/admin/manage/users', isAdmin, getUser);
// router.get('/admin/manage/user', (req, res) => {
//   res.render('Admin/users');
// });

// gets a user(admin route)
router.get('/user/view/:email', authenticateToken, viewUser);
router.get('/view/user/profile/:email', async (req, res) => {
  const userData = await userModel.findOne(
    { email: req.params.email },
    { password: 0 }
  );
  console.log(userData);
  res.render('Admin/viewUserProfile', { userData: userData });
});

// update a user (admin route)
router.get('/admin/update/user/:userId', async (req, res) => {
  const user = await userModel.find({ _id: req.params.userId });
  console.log('user-------------------');
  res.render('Admin/editUser', { user: user[0] });
});
// router.patch('/user/update/:userId', updateUser);
// strictly for none admins
router.get('/user/update/profile', (req, res) => {
  res.render('User/editProfile');
});
// delete a user
router.delete('/user/delete/:userId', authenticateToken, deleteUser);
router.patch('/user/deactivate/:userId', isAdmin, deactivateUser);
router.patch('/user/reactivate/:userId', isAdmin, reactivateUser);

module.exports = router;
/**
 *
 */
