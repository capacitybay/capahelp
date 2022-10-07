const { router } = require('../../utils/packages');

const authenticateToken = require('../../auth/authenticateToken');
const {
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
} = require('../controllers');


router.get("/ticket/view/:ticketId", getTicket);
router.post("/ticket/new", createTicket);
router.get("/ticket/list", listTicket);
router.put("/ticket/update/:ticketId", authenticateToken, updateTicket);
router.delete("/ticket/delete/:ticketId", authenticateToken, deleteTicket);


module.exports = router;
