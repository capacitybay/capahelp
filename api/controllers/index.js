const loginController = require("./loginController");
const {
  createUser,
  getUser,
  updateUser,
  viewUser,
} = require("./userController");
const {
  getTicketController,
  createTicketController,
} = require("./ticketController");

module.exports = {
  loginController,
  // ticket
  getTicketController,
  createTicketController,
  // customer
  createUser,
  getUser,
  updateUser,
  viewUser,
};
