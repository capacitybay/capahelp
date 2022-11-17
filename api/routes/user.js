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
} = require('../controllers');
const authenticateToken = require('../../auth/authenticateToken');
// const asyncWrapper = require('../../middleware/controllerWrapper');
// const TicketModel = require('../../models/ticketModel');
// const UserModel = require('../../models/userModel');
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
// function get
router.get('/admin/dashboard', isAdmin, adminDashboard);
// admin route
router.post('/user/create', adminCreateUser);

// gets all user (admin route)
router.get('/user/list', getUser);

// gets a user(admin route)
router.get('/user/view/:userId', authenticateToken, viewUser);

// update a user (admin route)
router.patch('/user/update/:userId', updateUser);
// delete a user
router.delete('/user/delete/:userId', authenticateToken, deleteUser);
router.put('/user/deactivate/:userId', authenticateToken, deactivateUser);
router.put('/user/reactivate/:userId', authenticateToken, reactivateUser);

module.exports = router;
/**
 *
 */
