const { router } = require('../../utils/packages');
const { isAdmin } = require('../../middleware/auth');
const authenticateToken = require('../../auth/authenticateToken');
const {
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
} = require('../controllers');

// router.get('/ticket/view/:ticketId', getTicket);
router.get('/admin/view/ticket', isAdmin, (req, res) => {
  res.render('Admin/view_ticket');
});
router.post('/ticket/new', authenticateToken, createTicket);
router.get('/ticket/list', isAdmin, listTicket);
router.patch('/ticket/update/:ticketId', authenticateToken, updateTicket);
router.delete('/ticket/delete/:ticketId', authenticateToken, deleteTicket);

module.exports = router;
/**
 * find if department exist if yes
 * compare dept details
 */
