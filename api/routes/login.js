const router = require("../../utils/sysRoute");

const { loginController } = require("../controllers");
// console.log(loginController);

router.post("/login", loginController);

module.exports = router;
