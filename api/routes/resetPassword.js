const { router } = require('../../utils/packages');
const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require('../../middleware/auth');
const { resetPassword } = require('../controllers');

router.patch('/password/reset/:userId', ensureAuthenticated, (req, res) => {
  res.redirect('/user');
});
router.get('/password/reset', (req, res) => {
  res.render('resetPassword.ejs');
});

module.exports = router;

// render id in template used id to select the element
