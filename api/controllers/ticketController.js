const TicketModel = require('../../models/ticketModel');
const asyncWrapper = require('../../middleware/controllerWrapper');
const createTicket = asyncWrapper(async (req, res) => {
  const newTicket = new TicketModel(req.body);

  const savedTicket = await newTicket.save();
  res.status(200).json(savedTicket);
});

const getTicket = asyncWrapper(async (req, res) => {
  res.status(200).json('get ticket new route');

  // resetPassword;
});

const updateTicket = asyncWrapper(async (req, res) => {
  // this controller updates the ticket base on the user type
  const ticketId = req.params.ticketId;

  let query = { _id: ticketId };
  const {
    dept_id,
    priority,
    ticket_status,
    urgency,
    assignee_id,
    ticket_type,
    title,
    customer_id,
    description,
    attachment,
  } = req.body;

  if (ticketId && req.user.role === 3) {
    const adminUpdatedTicket = await TicketModel.updateOne(query, {
      ticket_type,
      title,
      customer_id,
      description,
      dept_id,
      priority,
      ticket_status,
      urgency,
      assignee_id,
      attachment,
    });
    res.status(200).json(adminUpdatedTicket);
  } else if (ticketId && req.user.id && req.user.role === 0) {
    const userUpdatedTicket = await TicketModel.updateOne(query, {
      ticket_type,
      title,
      description,
      attachment,
    });
    res.status(200).json({
      success: true,
      payload: 'ticket was updated successfully',
    });
    res.status(200).json(userUpdatedTicket);
  } else {
    res.status(400).json({
      success: false,
      payload: 'ticket was not deleted ',
    });
  }
});

const listTicket = asyncWrapper(async (req, res) => {
  const getAllTickets = await TicketModel.find();

  res.status(200).json({
    success: true,
    result: getAllTickets,
  });
});

const deleteTicket = asyncWrapper(async (req, res) => {
  const ticketId = req.params.ticketId;

  if (
    (ticketId && req.user.role === 3) ||
    (req.user.id && req.user.role === 0)
  ) {
    const adminDeleteTicket = await TicketModel.deleteOne({
      _id: req.params.ticketId,
    });

    if (adminDeleteTicket.acknowledged) {
      res.status(200).json({
        success: true,
        payload: 'ticket was deleted successfully',
      });
    } else {
      res.status(200).json({
        success: false,
        payload: 'ticket was not  deleted ',
      });
    }
  }
});

module.exports = {
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
};
