const router = require("../../global/sysRoute");

const { createUser, getUser, updateUser, viewUser } = require("../controllers");

router.post("/user/create", createUser);

// gets all user
router.get("/user/list", getUser);

// gets a user
router.get("/user/view/:userId", viewUser);

// update a user
router.put("/user/update/:userId", updateUser);

module.exports = router;
