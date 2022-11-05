const { refreshUserToken } = require('../controllers');
const { router } = require('../../utils/packages');

router.post('/refresh', refreshUserToken);

module.exports = router;
