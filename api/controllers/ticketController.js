const TicketModel = require("../../models/ticketModel");

const createTicket = async (req, res) => {
  // {
  //   ticket_type,
  //   title,
  //   description,
  //   customer_id,
  //   assignee_id,
  //   dept_id,
  //   urgency,
  //   priority,
  //   ticket_status,
  //   attachment,
  // }
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
    res.status(200).json("get ticket route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const updateTicket = async (req, res) => {
  // testing update
  let query = { _id: "632f13e364f4d38f4dc1c494" };
  try {
    const updatedTicket = await TicketModel.updateOne(query, {
      dept_id: req.body.dept_id,
      priority: req.body.priority,
      ticket_status: req.body.ticket_status,
      urgency: req.body.urgency,
      assignee_id: req.body.assignee_id,
    });
    res.status(200).json(updatedTicket);
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const listTicket = (req, res) => {
  try {
    res.status(200).json("view ticket route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
const deleteTicket = (req, res) => {
  try {
    res.status(200).json("delete ticket route");
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
