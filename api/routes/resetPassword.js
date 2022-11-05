const { router } = require("../../utils/packages");
const authenticateToken = require("../../auth/authenticateToken");
const { resetPassword } = require("../controllers");

router.put("/reset/password/:userId", authenticateToken, resetPassword);

module.exports = router;
