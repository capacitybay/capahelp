const { router } = require('../../utils/packages');
const { ensureAuthenticated } = require('../../middleware/auth');
router.get('/user', (req, res) => {
  res.render('User/home.ejs');
});

module.exports = router;
