const { loginController, refreshUserToken } = require('./loginController');
const {
  createUser,
  getUser,
  postAdminUpdateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
  postAdminCreateUser,
  adminDashboard,
  filterUsers,
  adminUpdateProfile,
  updateProfile,
  viewUserProfile,
  getAdminCreateUser,
  getAdminUpdateUser,
  getRegisterComponent,
} = require('./userController');

const {
  getTicket,
  getAdminCreateTicket,
  listTicket,
  updateTicket,
  deleteTicket,

  postAdminCreateTicket,
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
  // viewDepartment,
  removeAgentFromDepartment,
  viewDepartment,
  deactivateDepartment,
  reactivateDepartment,
  getUpdateDepartment,
  getCreateDepartment,
  filterDepartments,
  getFilterDepartments,
} = require('./departmentController');
const resetPassword = require('./resetPasswordController');

const addAgentToDept = require('./manageAgentDept');
module.exports = {
  loginController,
  // ticket
  getTicket,
  getAdminCreateTicket,
  listTicket,
  updateTicket,
  deleteTicket,
  postAdminCreateTicket,
  filterTickets,
  // customer
  createUser,
  getUser,
  filterUsers,
  adminUpdateProfile,
  postAdminUpdateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
  updateProfile,
  viewUserProfile,
  getAdminCreateUser,
  getAdminUpdateUser,
  getRegisterComponent,
  // department
  createDepartment,
  getDepartment,
  getCreateDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
  deactivateDepartment,
  reactivateDepartment,
  getUpdateDepartment,
  deleteDepartment,
  filterDepartments,
  getFilterDepartments,
  // resetPassword
  resetPassword,
  removeAgentFromDepartment,
  addAgentToDept,
  postAdminCreateUser,
  refreshUserToken,
  // admin dashboard
  adminDashboard,
  // viewDepartment,
  getAdminEditTicket,
  patchAdminEditTicket,
  adminDeleteTicket,
};
