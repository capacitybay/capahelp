const { router } = require('../../utils/packages');

router.get('/error', (req, res) => {
  res.render('Errors/error403.ejs');
});
module.exports = router;
