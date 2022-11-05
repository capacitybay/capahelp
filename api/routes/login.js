const { router } = require('../../utils/packages');

const { loginController } = require('../controllers');
// console.log(loginController);

router.post('/login', loginController);
router.get('/login', (req, res) => {
  res.render('login');
});

module.exports = router;
