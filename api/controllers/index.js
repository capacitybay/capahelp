const { loginController, refreshUserToken } = require('./loginController');
const {
  createUser,
  getUser,
  updateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
  adminCreateUser,
  adminDashboard,
  filterUsers,
  adminUpdateProfile,
  updateProfile,
  viewUserProfile,
  getAdminCreateUser,
  getAdminUpdateUserProfile,
  getRegisterComponent,
} = require('./userController');

const {
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
  activeTickets,
  cancelledTickets,
  inProgressTickets,
  pendingTickets,
  resolvedTickets,
  adminCreateTicket,
  getAdminEditTicket,
  patchAdminEditTicket,
  adminDeleteTicket,
  filterTickets,
} = require('./ticketController');

const {
  createDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
  removeAgentFromDepartment,
} = require('./departmentController');
const resetPassword = require('./resetPasswordController');

const addAgentToDept = require('./manageAgentDept');
module.exports = {
  loginController,
  // ticket
  getTicket,
  createTicket,
  listTicket,
  updateTicket,
  deleteTicket,
  adminCreateTicket,
  filterTickets,
  // customer
  createUser,
  getUser,
  filterUsers,
  adminUpdateProfile,
  updateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
  updateProfile,
  viewUserProfile,
  getAdminCreateUser,
  getAdminUpdateUserProfile,
  getRegisterComponent,
  // department
  createDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,

  // resetPassword
  resetPassword,
  removeAgentFromDepartment,
  addAgentToDept,
  adminCreateUser,
  refreshUserToken,
  // admin dashboard
  adminDashboard,
  activeTickets,
  cancelledTickets,
  inProgressTickets,
  pendingTickets,
  resolvedTickets,
  getAdminEditTicket,
  patchAdminEditTicket,
  adminDeleteTicket,
};
