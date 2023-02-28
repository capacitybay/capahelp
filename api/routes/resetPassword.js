const { router } = require('../../utils/packages');
const {
  ensureAuthenticated,
  forwardAuthenticated,
} = require('../../middleware/auth');
const { resetPassword } = require('../controllers');

router.patch('/password/reset', ensureAuthenticated, resetPassword);
router.get('/password/reset', ensureAuthenticated, (req, res) => {
  res.render('resetPassword.ejs', {
    errors: undefined,
    user: req.user[0],
  });
});

module.exports = router;

// render id in template used id to select the element
/**
 *
 */
