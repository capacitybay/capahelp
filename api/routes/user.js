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
const { forwardAuthenticated } = require('../../middleware/auth');
router.get('/user/register', (req, res) => {
  return res.render('register', {
    message: null,
    email: null,
  });
  // return
});
router.post('/user/register', createUser);
router.post('/user/create', authenticateToken, adminCreateUser);

// gets all user
router.get('/user/list', authenticateToken, getUser);

// gets a user
router.get('/user/view/:userId', authenticateToken, viewUser);

// update a user
router.patch('/user/update/:userId', authenticateToken, updateUser);
// delete a user
router.delete('/user/delete/:userId', authenticateToken, deleteUser);
router.put('/user/deactivate/:userId', authenticateToken, deactivateUser);
router.put('/user/reactivate/:userId', authenticateToken, reactivateUser);

module.exports = router;
/**
 *
 */
