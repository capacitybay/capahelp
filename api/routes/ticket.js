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
  adminCreateTicket,
} = require('../controllers');

const {
  forwardAuthenticated,
  ensureAuthenticated,
} = require('../../middleware/auth');
router.post('/ticket/new', createTicket);

// admin routes
router.get('/admin/view/ticket/:ticketId', isAdmin, getTicket);
router.get('/admin/ticket/list/active', isAdmin, activeTickets);
router.get('/admin/ticket/list/cancelled', isAdmin, cancelledTickets);
router.get('/admin/ticket/list/inProgress', isAdmin, inProgressTickets);
router.get('/admin/ticket/list/pending', isAdmin, pendingTickets);
router.get('/admin/ticket/list/resolved', isAdmin, resolvedTickets);
router.get('/admin/ticket/list', isAdmin, listTicket);
// Todo: still under review
router.patch('/ticket/update/:ticketId', authenticateToken, updateTicket);
router.delete('/ticket/delete/:ticketId', authenticateToken, deleteTicket);

router.get('/user/tickets', ensureAuthenticated, (req, res) => {
  res.render('User/tickets', {
    userFN: req.user[0].first_name,
    userLN: req.user[0].last_name,
    userEmail: req.user[0].email,
  });
});
router.get('/user/create/ticket', ensureAuthenticated, (req, res) => {
  res.render('User/createTicket', {
    userFN: req.user[0].first_name,
    userLN: req.user[0].last_name,
    userEmail: req.user[0].email,
  });
});
router.get('/admin/create/ticket', ensureAuthenticated, (req, res) => {
  res.render('Admin/adminCreateTicket', { user: req.user[0], id: undefined });
});
router.post('/admin/create/ticket', adminCreateTicket);
module.exports = router;
/**
 * Tfind if department exist if yes
 * compare dept details
 */
