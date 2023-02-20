const { router } = require('../../utils/packages');
const { ensureAuthenticated } = require('../../middleware/auth');
const asyncWrapper = require('../../middleware/controllerWrapper');
// customer landing page
router.get(
  '/user',
  ensureAuthenticated,

  asyncWrapper((req, res) => {
    res.render('User/home.ejs', {
      userFN: req.user[0].first_name,
      userLN: req.user[0].last_name,
      userEmail: req.user[0].email,
    });
  })
);

// application landing page
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
