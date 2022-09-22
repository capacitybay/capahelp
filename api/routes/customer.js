const router = require("../../global/sysRoute");

const {
  getCustomersController,
  createCustomerController,
  updateCustomerController,
  getCustomerController,
} = require("../controllers");

router.post("/reg_customer", createCustomerController);

// gets all customers
router.get("/view_customers", getCustomersController);

// gets a customer
router.get("/view_customer/:customerId", getCustomerController);

// update a customer
router.put("/update_customer/:customerId", updateCustomerController);

module.exports = router;
