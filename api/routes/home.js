const { router } = require('../../utils/packages');
const { ensureAuthenticated } = require('../../middleware/auth');
router.get('/', (req, res) => {
  res.render('home.ejs');
});

module.exports = router;
