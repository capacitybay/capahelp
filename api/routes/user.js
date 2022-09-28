const router = require("../../utils/sysRoute");

const {
  createUser,
  getUser,
  updateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
} = require("../controllers");
const authenticateToken = require("../../auth/authenticateToken");
router.post("/user/register", createUser);

// gets all user
router.get("/user/list", authenticateToken, getUser);

// gets a user
router.get("/user/view/:userId", authenticateToken, viewUser);

// update a user
router.get("/user/update/:userId", authenticateToken, updateUser);
// delete a user
router.delete("/user/delete/:userId", deleteUser);
router.put("/user/deactivate/:userId", deactivateUser);
router.put("/user/reactivate/:userId", reactivateUser);

module.exports = router;