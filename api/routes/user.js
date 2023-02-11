const { router } = require('../../utils/packages');
const {
  createUser,
  getUser,
  postAdminUpdateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
  postAdminCreateUser,
  adminDashboard,
  filterUsers,
  adminUpdateProfile,
  updateProfile,
  viewUserProfile,
  getAdminCreateUser,
  getAdminUpdateUser,
  getRegisterComponent,
} = require('../controllers');
const authenticateToken = require('../../auth/authenticateToken');

const {
  forwardAuthenticated,
  ensureAuthenticated,
  isAdmin,
} = require('../../middleware/auth');

const userModel = require('../../models/userModel');
/**
 * !USER ROUTES (CODE 0 AND 2 )
 */
// TODO:Prevent admin from login in as user

// solutions
router.get('/user/solutions', ensureAuthenticated, (req, res) => {
  res.render('User/solutions.ejs', {
    first_name: req.user[0].first_name,
    last_name: req.user[0].last_name,
    email: req.user[0].email,
  });
});
router.get('/user/profile/edit', ensureAuthenticated, (req, res) => {
  res.render('User/editProfile', {
    userFN: req.user[0].first_name,
    userLN: req.user[0].last_name,
    userEmail: req.user[0].email,
  });
});

/**
 * *END OF USER ROUTES
 */

// ! GENERAL ROUTE
router.get('/user/register', (req, res) => {
  return res.render('register', {
    message: null,
    email: null,
  });
  // return
});
// POST RE
router.post('/user/register', createUser);

/**
 ** END OF GENERAL ROUTE
 *
 */

// ! ADMIN ROUTES
router.get('/admin/register', isAdmin, getAdminCreateUser);
router.post('/admin/register', isAdmin, postAdminCreateUser);
router.get('/view/user/profile/:email', viewUserProfile);

router.post('/filter/users', isAdmin, filterUsers);

// admin edit profile
router.get(
  '/admin/profile/edit',
  ensureAuthenticated,
  isAdmin,
  adminUpdateProfile
);

// Admin dashboard route
router.get('/admin/dashboard', isAdmin, adminDashboard);
// gets all user (admin route)
router.get('/admin/manage/users', isAdmin, getUser);
// *? what is the function of this route
// router.get('/admin/register', isAdmin, getRegisterComponent);

// update a user (admin route)
router.get('/admin/update/user/:userId', isAdmin, getAdminUpdateUser);
router.post('/admin/update/user/:userId', isAdmin, postAdminUpdateUser);

router.patch('/admin/update/profile/:userId', isAdmin, updateProfile);

// TODO: WORK ON CHANGING THE ROUTE FROM USER TO ADMIN
router.delete('/user/delete/:userId', isAdmin, deleteUser);
router.patch('/user/deactivate/:userId', isAdmin, deactivateUser);
router.patch('/user/reactivate/:userId', isAdmin, reactivateUser);
// !END OF ADMIN ROUTE

// gets a user(admin route)
router.get('/user/view/:email', authenticateToken, viewUser);
// router.get('/view/user/profile/:email', async (req, res) => {
//   const userData = await userModel.findOne(
//     { email: req.params.email },
//     { password: 0 }
//   );
//   console.log(req.user[0]);
//   res.render('Admin/viewUserProfile', {
//     userData: userData,
//     user: req.user[0],
//   });
// });

module.exports = router;
