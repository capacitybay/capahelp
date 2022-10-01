const router = require("../../utils/sysRoute");
const authenticateToken = require("../../auth/authenticateToken");
const { resetPassword } = require("../controllers");

router.put("/reset/password/:userId", authenticateToken, resetPassword);

module.exports = router;
