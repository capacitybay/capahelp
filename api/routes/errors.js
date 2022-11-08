const { router } = require('../../utils/packages');

router.get('/error', (req, res) => {
  res.render('authError.ejs');
});
module.exports = router;
