const { router } = require('../../utils/packages');
const UserModel = require('../../models/userModel');
const { loginController } = require('../controllers');
const { forwardAuthenticated } = require('../../middleware/auth');
const passport = require('passport');
const initializePassport = require('../../middleware/passportConfig');

// console.log(loginController);
initializePassport(
  passport,
  (email) => UserModel.findOne({ email: email }),
  (id) => UserModel.find({ _id: id })
);
router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login.ejs', { message: null });
});
router.post(
  '/login',
  forwardAuthenticated,
  passport.authenticate('local', {
    successRedirect: '/api/v1/',
    failureRedirect: '/api/v1/login',
    failureFlash: true,
  })
);

module.exports = router;
