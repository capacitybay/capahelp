const { router } = require('../../utils/packages');
const UserModel = require('../../models/userModel');
const { loginController } = require('../controllers');
const { forwardAuthenticated } = require('../../middleware/auth');
const passport = require('passport');
const initializePassport = require('../../auth/passportConfig');

// console.log(loginController);
initializePassport(
  passport,
  (email) => UserModel.findOne({ email: email }),
  (id) => UserModel.findOne({ _id: id })
);

router.get('/login', forwardAuthenticated, (req, res) => {
  res.render('login.ejs');
});
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (error, user, info) => {
    if (error) return res.status(400).json({ success: false, payload: info });
    if (!user) return res.status(400).json({ success: false, payload: info });
    if (user) {
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        // checks if user is admin or customer

        console.log(req.user);
        if (user?.user_type === 3) {
          return res.send({ success: true, user_type: 3 });
        } else if (user?.user_type === 0) {
          return res.send({ success: true, user_type: 0 });
        }
      });
    }
    // return (req.user = user);
  })(req, res, next);
});

router.post('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
});
module.exports = router;
