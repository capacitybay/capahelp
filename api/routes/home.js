const { router } = require('../../utils/packages');
const { ensureAuthenticated } = require('../../middleware/auth');
router.get('/user', ensureAuthenticated, (req, res) => {
  res.render('User/home.ejs',
  {
    userFN: req.user[0].first_name, 
    userLN: req.user[0].last_name, 
    userEmail: req.user[0].email
  });
});
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
