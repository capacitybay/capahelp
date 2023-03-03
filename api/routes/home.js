const { router } = require('../../utils/packages');
const { ensureAuthenticated } = require('../../middleware/auth');
const asyncWrapper = require('../../middleware/controllerWrapper');
// customer landing page
router.get(
  '/user',
  ensureAuthenticated,

  asyncWrapper((req, res) => {
    res.render('User/home.ejs', {
      user: req.user[0],
    });
  })
);

// application landing page
router.get('/', (req, res) => {
  res.render('index');
});
router.get("/terms", (req, res) => {
  res.render("terms");

})

module.exports = router;
