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
} = require('../controllers');

// router.get('/ticket/view/:ticketId', getTicket);
router.get(
  '/admin/view/ticket',
  isAdmin,
  asyncWrapper((req, res) => {
    const tickets = TicketModel.find();
    console.log(tickets);
    res.render('Admin/view_ticket');
  })
);
router.post('/ticket/new', createTicket);
router.get('/ticket/list', isAdmin, listTicket);
router.patch('/ticket/update/:ticketId', authenticateToken, updateTicket);
router.delete('/ticket/delete/:ticketId', authenticateToken, deleteTicket);

module.exports = router;
/**
 * find if department exist if yes
 * compare dept details
 */
