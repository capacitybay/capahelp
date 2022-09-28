const router = require("../../utils/sysRoute");
const {
  createDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
} = require("../controllers");

router.get("/department/list", getDepartment);
router.post("/department/create", createDepartment);
router.put("/department/update", updateDepartment);
router.delete("/department/delete", deleteDepartment);
router.get("/department/view", viewDepartment);

module.exports = router;
