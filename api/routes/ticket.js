const { router } = require('../../utils/packages');
const { isAdmin } = require('../../middleware/auth');
const authenticateToken = require('../../auth/authenticateToken');
const {
  getAdminGetTicket,
  getAdminCreateTicket,
  listTicket,
  updateTicket,
  deleteTicket,
  activeTickets,
  cancelledTickets,
  inProgressTickets,
  pendingTickets,
  resolvedTickets,
  postAdminCreateTicket,
  postCustomerCreateTicket,
  getAdminEditTicket,
  patchAdminEditTicket,
  getCustomerListTickets,
  getCustomerRequestTickets,
  adminDeleteTicket,
  filterTickets,
  customerGetTicket,
  postUserConversation,
  postAdminConversation,
  userResolveTicket,
} = require('../controllers');

const {
  forwardAuthenticated,
  ensureAuthenticated,
} = require('../../middleware/auth');
router.post('/ticket/new', getAdminCreateTicket);

// admin routes
router.get('/admin/update/ticket/:ticketId', isAdmin, getAdminEditTicket);
router.patch('/admin/update/ticket/:ticketId', isAdmin, patchAdminEditTicket);
router.delete('/admin/delete/ticket/:ticketId', isAdmin, adminDeleteTicket);
router.get('/admin/view/ticket/:ticketId', isAdmin, getAdminGetTicket);
router.get(
  '/user/view/ticket/:ticketId',
  ensureAuthenticated,
  customerGetTicket
);
// router.get('/admin/ticket/list/active', isAdmin, activeTickets);
// router.get('/admin/ticket/list/cancelled', isAdmin, cancelledTickets);
// router.get('/admin/ticket/list/inProgress', isAdmin, inProgressTickets);
// router.get('/admin/ticket/list/pending', isAdmin, pendingTickets);
// router.get('/admin/ticket/list/resolved', isAdmin, resolvedTickets);
router.get('/admin/ticket/list', isAdmin, listTicket);
router.post('/admin/filter/tickets', isAdmin, filterTickets);
// Todo: still under review
router.patch('/ticket/update/:ticketId', authenticateToken, updateTicket);
router.delete('/ticket/delete/:ticketId', authenticateToken, deleteTicket);
// get al tickets
router.get('/user/tickets', ensureAuthenticated, getCustomerListTickets);
router.get(
  '/user/request/tickets',
  ensureAuthenticated,
  getCustomerRequestTickets
);

// get create ticket
router.get('/user/create/ticket', ensureAuthenticated, (req, res) => {
  res.render('User/createTicket', {
    user: req.user[0],
  });
});
router.post(
  '/user/create/ticket',
  ensureAuthenticated,
  postCustomerCreateTicket
);
//User Create Chat Conversation
router.post(
  '/user/create/conversation',
  ensureAuthenticated,
  postUserConversation
);

//Admin Create Chat Conversation
router.post('/admin/create/conversation', isAdmin, postAdminConversation);

router.get('/admin/create/ticket', ensureAuthenticated, (req, res) => {
  res.render('Admin/adminCreateTicket', { user: req.user[0], id: undefined });
});
router.post('/admin/create/ticket', isAdmin, postAdminCreateTicket);
router.patch(
  '/resolve/ticket:ticketId',
  ensureAuthenticated,
  userResolveTicket
);

module.exports = router;
