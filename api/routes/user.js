const router = require("../../global/sysRoute");

const {
  createUser,
  getUser,
  updateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
} = require("../controllers");

router.post("/user/register", createUser);

// gets all user
router.get("/user/list", getUser);

// gets a user
router.get("/user/view/:userId", viewUser);

// update a user
router.put("/user/update/:userId", updateUser);
// delete a user
router.delete("/user/delete/:userId", deleteUser);
router.put("/user/deactivate/:userId", deactivateUser);
router.put("/user/reactivate/:userId", reactivateUser);

module.exports = router;
