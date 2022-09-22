const router = require("express").Router();
const {
  getTicketController,
  createTicketController,
} = require("../controllers");
// this should be a post request
router.get("/view_ticket", getTicketController);
router.post("/create_ticket", createTicketController);

module.exports = router;
