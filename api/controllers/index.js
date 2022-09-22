const loginController = require("./loginController");
const {
  createCustomerController,
  getCustomersController,
  updateCustomerController,
  getCustomerController,
} = require("./customerController");
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
  createCustomerController,
  getCustomersController,
  updateCustomerController,
  getCustomerController,
};
