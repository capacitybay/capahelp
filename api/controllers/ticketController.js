const TicketModel = require('../../models/ticketModel');

const createTicket = async (req, res) => {
  const newTicket = new TicketModel(req.body);
  try {
    const savedTicket = await newTicket.save();
    res.status(200).json(savedTicket);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getTicket = (req, res) => {
  try {
    res.status(200).json('get ticket new route');
  } catch (error) {
    res.status(500).json(error.message);
  }
  // resetPassword;
};

const updateTicket = async (req, res) => {
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

  try {
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
        Msg: 'ticket was updated successfully',
      });
      res.status(200).json(userUpdatedTicket);
    } else {
      res.status(400).json({
        success: false,
        Msg: 'ticket was not deleted ',
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const listTicket = async (req, res) => {
  try {
    const getAllTickets = await TicketModel.find();

    res.status(200).json({
      success: true,
      result: getAllTickets,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const deleteTicket = async (req, res) => {
  const ticketId = req.params.ticketId;

  try {
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
          Msg: 'ticket was deleted successfully',
        });
      } else {
        res.status(200).json({
          success: false,
          Msg: 'ticket was not  deleted ',
        });
      }
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
};
