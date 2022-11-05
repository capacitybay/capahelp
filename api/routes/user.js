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

router.get('/user/register', (req, res) => {
  // const resData = await axios.get('https://restcountries.com/v2/all');
  // // resData..forEach((element) => {
  // // });
  // console.log(res);
  res.render('register.ejs', {
    message: null,
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
