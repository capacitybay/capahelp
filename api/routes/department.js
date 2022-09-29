const router = require("../../utils/sysRoute");
const authenticateToken = require("../../auth/authenticateToken");
const {
  createDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
} = require("../controllers");

router.get("/department/list", getDepartment);
router.post("/department/create", authenticateToken, createDepartment);
router.put("/department/update/:deptId", authenticateToken, updateDepartment);
router.delete(
  "/department/delete/:deptId",
  authenticateToken,
  deleteDepartment
);
router.get("/department/view", viewDepartment);

module.exports = router;
