const { router } = require('../../utils/packages');
const { ensureAuthenticated } = require('../../middleware/auth');
router.get('/user', (req, res) => {
  res.render('User/home.ejs');
});
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
