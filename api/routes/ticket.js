const { router } = require('../../utils/packages');
const { isAdmin } = require('../../middleware/auth');
const authenticateToken = require('../../auth/authenticateToken');
const asyncWrapper = require('../../middleware/controllerWrapper');
const TicketModel = require('../../models/ticketModel');
const {
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
  activeTickets,
  cancelledTickets,
  inProgressTickets,
  pendingTickets,
  resolvedTickets,
} = require('../controllers');

router.get('/admin/view/ticket/:ticketId', isAdmin, getTicket);
// router.get(
//   '/admin/view/ticket',
//   isAdmin,

// );
router.post('/ticket/new', createTicket);
// admin route
router.get('/admin/ticket/list/active', isAdmin, activeTickets);
router.get('/admin/ticket/list/cancelled', isAdmin, cancelledTickets);
router.get('/admin/ticket/list/inProgress', isAdmin, inProgressTickets);
router.get('/admin/ticket/list/pending', isAdmin, pendingTickets);
router.get('/admin/ticket/list/resolved', isAdmin, resolvedTickets);
// router.get('/admin/ticket/list/cancelled', isAdmin, cancelledTickets);
router.get('/ticket/list', isAdmin, listTicket);
router.patch('/ticket/update/:ticketId', authenticateToken, updateTicket);
router.delete('/ticket/delete/:ticketId', authenticateToken, deleteTicket);

module.exports = router;
/**
 * find if department exist if yes
 * compare dept details
 */
