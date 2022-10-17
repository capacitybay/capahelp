const { router } = require('../../utils/packages');

const authenticateToken = require('../../auth/authenticateToken');
const {
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
} = require('../controllers');

router.get('/ticket/view/:ticketId', authenticateToken, getTicket);
router.post('/ticket/new', authenticateToken, createTicket);
router.get('/ticket/list', authenticateToken, listTicket);
router.patch('/ticket/update/:ticketId', authenticateToken, updateTicket);
router.delete('/ticket/delete/:ticketId', authenticateToken, deleteTicket);

module.exports = router;
/**
 * find if department exist if yes
 * compare dept details
 */
