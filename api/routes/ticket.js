const { router } = require('../../utils/packages');
const { isAdmin } = require('../../middleware/auth');
const authenticateToken = require('../../auth/authenticateToken');
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

router.post('/ticket/new', createTicket);

// admin routes
router.get('/admin/view/ticket/:ticketId', isAdmin, getTicket);
router.get('/admin/ticket/list/active', isAdmin, activeTickets);
router.get('/admin/ticket/list/cancelled', isAdmin, cancelledTickets);
router.get('/admin/ticket/list/inProgress', isAdmin, inProgressTickets);
router.get('/admin/ticket/list/pending', isAdmin, pendingTickets);
router.get('/admin/ticket/list/resolved', isAdmin, resolvedTickets);
router.get('/admin/ticket/list', isAdmin, listTicket);
// still under review
router.patch('/ticket/update/:ticketId', authenticateToken, updateTicket);
router.delete('/ticket/delete/:ticketId', authenticateToken, deleteTicket);

module.exports = router;
/**
 * find if department exist if yes
 * compare dept details
 */
