const loginController = require("./loginController");
const {
  createUser,
  getUser,
  updateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
} = require("./userController");

const {
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
} = require("./ticketController");

const {
  createDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
} = require("./departmentController");
const resetPassword = require("./resetPasswordController");
console.log(resetPassword);
module.exports = {
  loginController,
  // ticket
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
  // customer
  createUser,
  getUser,
  updateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
  // department
  createDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,

  // resetPassword
  resetPassword,
};
