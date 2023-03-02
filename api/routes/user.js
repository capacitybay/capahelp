const { router } = require('../../utils/packages');
const {
  userRegistration,
  postAdminUpdateUser,
  viewUser,
  adminDeleteUser,
  adminDeactivateUser,
  adminReactivateUser,
  getAdminDashboard,
  adminGetUser,
  postAdminCreateUser,
  filterUsers,
  adminUpdateProfile,
  updateProfile,
  adminViewUserProfile,
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
  console.log(req.user);
  res.render('User/solutions.ejs', {
    user: req.user[0],
  });
});
router.get('/user/profile/edit', ensureAuthenticated, (req, res) => {
  res.render('User/editProfile', {
    user: req.user[0],
  });
});
router.patch('/user/profile/edit', ensureAuthenticated, updateProfile);

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
router.post('/user/register', userRegistration);

/**
 ** END OF GENERAL ROUTE
 *
 */

// ! ADMIN ROUTES
router.get('/admin/register', isAdmin, getAdminCreateUser);
router.post('/admin/register', isAdmin, postAdminCreateUser);
router.get('/view/user/profile/:email', adminViewUserProfile);

router.post('/filter/users', isAdmin, filterUsers);

// admin edit profile
router.get(
  '/admin/profile/edit',
  ensureAuthenticated,
  isAdmin,
  adminUpdateProfile
);

// Admin dashboard route
router.get('/admin/dashboard', isAdmin, getAdminDashboard);
// gets all user (admin route)
router.get('/admin/manage/users', isAdmin, adminGetUser);
// *? what is the function of this route
// router.get('/admin/register', isAdmin, getRegisterComponent);

// update a user (admin route)
router.get('/admin/update/user/:userId', isAdmin, getAdminUpdateUser);
router.post('/admin/update/user/:userId', isAdmin, postAdminUpdateUser);

router.patch('/admin/update/profile/:userId', isAdmin, updateProfile);
router.patch(
  '/user/update/profile/:userId',
  ensureAuthenticated,
  updateProfile
);

// TODO: WORK ON CHANGING THE ROUTE FROM USER TO ADMIN
router.delete('/user/delete/:userId', isAdmin, adminDeleteUser);
router.patch('/user/deactivate/:userId', isAdmin, adminDeactivateUser);
router.patch('/user/reactivate/:userId', isAdmin, adminReactivateUser);
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
