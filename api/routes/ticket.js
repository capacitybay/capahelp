const router = require("express").Router();
const {
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers");
// this should be a post request
router.get("/ticket/view/:ticketId", getTicket);
router.post("/ticket/create", createTicket);
router.post("/ticket/list", listTicket);
router.post("/ticket/update", updateTicket);
router.post("/ticket/delete", deleteTicket);

module.exports = router;
