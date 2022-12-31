const TicketModel = require('../../models/ticketModel');
const asyncWrapper = require('../../middleware/controllerWrapper');
const { createCustomError } = require('../../middleware/customError');
const { find, findOne } = require('../../models/departmentModel');
const { resolveHostname } = require('nodemailer/lib/shared');
const UserModel = require('../../models/userModel');
const userModel = require('../../models/userModel');
const { validateEmail } = require('../../validation/validation');
// const { findOne } = require('../../models/departmentModel');

const verifyUser = (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, payload: 'You are not authenticated' });
};
const createTicket = asyncWrapper(async (req, res) => {
  // console.log(req.user);

  // if (!req.user)
  //   return res
  //     .status(401)
  //     .json({ success: false, payload: 'You are not authenticated' });

  /** still working on this
   * const findTicket = await findOne({
   * $and: [{ customer_id: req.body.customer_id }, { title: req.body.title }],
   *  });
   * if (findTicket) {
   * return res
   * .status(400)
   * .json({ success: false, payload: 'Ticket already exist! ' });
   * }
   */

  // redirect to update ticket

  const newTicket = new TicketModel(req.body);
  const savedTicket = await newTicket.save();

  res.status(201).json({ success: true, payload: savedTicket });
});

const getAdminEditTicket = asyncWrapper(async (req, res) => {
  const fetchedTicket = await TicketModel.findOne({ _id: req.params.ticketId });

  if (fetchedTicket) {
    return res.render('Admin/adminEditTicket', {
      title: fetchedTicket.title,
      ticket_type: fetchedTicket.ticket_type,
      customer_email: fetchedTicket.customer_id
        ? fetchedTicket.customer_id
        : '',
      assignee_email: fetchedTicket.assignee_id
        ? fetchedTicket.assignee_id
        : '',
      dept_id: fetchedTicket.dept_id,
      priority: fetchedTicket.priority,
      urgency: fetchedTicket.urgency,
      ticket_status: fetchedTicket.ticket_status,
      user: req.user[0],
      description: fetchedTicket.description ? fetchedTicket.description : '',
    });
  }
});
const patchAdminEditTicket = asyncWrapper(async (req, res) => {
  const ticketId = req.params.ticketId;
  if (!ticketId)
    return res.send({
      success: false,
      msg: 'No Ticket Found With The selected Id!',
    });
  const {
    ticket_type,
    title,
    customer_id,
    assignee_id,
    dept_id,
    urgency,
    priority,
    ticket_status,
    description,
  } = req.body;

  if (
    !ticket_type ||
    !title ||
    !customer_id ||
    !urgency ||
    !priority ||
    !ticket_status ||
    !description
  )
    return res.send({
      success: false,
      msg: 'Inputs fields marked with *, cannot be empty!',
    });
  //
  // if (!assignee_id && dept_id === 'none')
  //   return res.send({
  //     success: false,
  //     msg: 'You Must Choose Assignee Or Department Field',
  //     payload: {
  //       ticket_type,
  //       title,
  //       customer_id,
  //       assignee_id,
  //       dept_id,
  //       urgency,
  //       priority,
  //       ticket_status,
  //       description,
  //     },
  //   });
  /**
   * @param all parameter are of type String and are validated before passed as arg
   * * This function is responsible for updating ticket with respect to provided args
   */
  const updateTicketFn = async (
    addDept,
    _ticket_type,
    _title,
    _customer_id,
    _assignee_id,
    _dept_id,
    _urgency,
    _priority,
    _ticket_status,
    _description
  ) => {
    const updateTicketInfo = {
      ticket_type: _ticket_type,
      title: _title,
      customer_id: _customer_id,
      urgency: _urgency,
      priority: _priority,
      ticket_status: _ticket_status,
      description: _description,
    };
    // *checks if user entered both assignee and department
    if (_dept_id !== 'none' && _assignee_id)
      return res.send({
        success: false,
        msg: 'Please Select Either An Assignee Or Department',
      });
    // this changes the values of dept_id and assignee_id based on the conditions below
    updateTicketInfo.dept_id =
      _dept_id.toLowerCase() === 'none' ? null : _dept_id;
    updateTicketInfo.assignee_id = !_assignee_id ? null : _assignee_id;
    console.log(updateTicketInfo);
    //*creates a new instance of the ticket model
    // const newTicket = new TicketModel(updateTicketInfo);
    const updatedTicket = await TicketModel.findOneAndUpdate(
      { _id: ticketId },
      updateTicketInfo,
      { new: true }
    );
    // sends created ticket and a success msg
    console.log(updatedTicket);
    return res.send({
      success: true,
      msg: `Ticket ${ticketId} Has Been Updated !`,
      payload: updatedTicket,
    });
  };
  //* email validation start
  const { error: customerValError } = await validateEmail({
    email: customer_id,
  });
  const { error: agentValError } = await validateEmail({ email: assignee_id });
  // console.log(customerValError, agentValError);

  // * Email validation end

  // *Checks if error was returned from the validation
  if (customerValError)
    return res.send({ success: false, msg: customerValError.message });
  // if(assignee_id)
  if (assignee_id && agentValError)
    return res.send({ success: false, msg: agentValError.message });

  // *fetch customer  with the provided email
  const getUserInfo = await userModel.findOne(
    { email: customer_id },
    { password: 0 }
  );

  // *fetch Agent  with the provided email ie if email is provided
  const getAssigneeInfo = await userModel.findOne(
    { email: assignee_id },
    { password: 0 }
  );

  // *check if customer and agent exist in th DB
  if (!getUserInfo)
    return res.send({
      success: false,
      msg: `This customer ${customer_id} does not exist,Please create account for this customer`,
    });
  if (assignee_id && !getAssigneeInfo)
    return res.send({
      success: false,
      msg: `Agent ${assignee_id} does not exist!`,
    });

  // *Checks if assignee is a customer
  if (getAssigneeInfo && getAssigneeInfo.user_type === 0)
    return res.send({
      success: false,
      msg: "You Can't Assign Ticket To A Customer ",
    });
  if (dept_id) {
    updateTicketFn(
      true,
      ticket_type,
      title,
      customer_id,
      assignee_id, //remove
      dept_id,
      urgency,
      priority,
      ticket_status,
      description
    );
  } else {
    updateTicketFn(
      false,
      ticket_type,
      title,
      customer_id,
      assignee_id,
      dept_id,
      urgency,
      priority,
      ticket_status,
      description
    );
  }
});

/**
 ** DELETE TICKET
 */
const adminDeleteTicket = asyncWrapper(async (req, res) => {
  const ticketId = req.params.ticketId;
  console.log('888888888888888888888888');
  console.log(ticketId);
  const deletedTicket = await TicketModel.findOneAndDelete(
    { _id: ticketId },
    { new: true }
  );
  console.log(deletedTicket);
  return res.send({
    success: true,
    msg: `You have successfully deleted ${deletedTicket._id}`,
  });
});

// gets a single ticket

const getTicket = asyncWrapper(async (req, res, next) => {
  if (req.user[0].user_type === 3) {
    const ticket = await TicketModel.findOne({ _id: req.params.ticketId });
    if (!ticket) return next(createCustomError('no ticket found!', 404));

    // let ticketOwners = [];

    let ticketUser = await UserModel.find(
      {
        email: ticket.customer_id,
      },
      { password: 0 }
    );
    console.log(ticketUser);

    res.status(200).render('Admin/view_ticket', {
      user: req.user[0],
      ticket: ticket,
      ticketOwner: ticketUser,
    });
  } else {
    res.status(401).json({
      success: false,
      payload: 'you are not authorized to perform this operation ',
    });
  }

  // res.status(200).json('get ticket new route');

  // resetPassword;
});

// TODO: check this
const updateTicket = asyncWrapper(async (req, res, next) => {
  // this controller updates the ticket base on the user type
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, payload: 'You are not authenticated' });
  const ticketId = req.params.ticketId;

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

  let query = { _id: ticketId };
  const findTicket = await TicketModel.findOne({ _id: ticketId });
  // console.log(findTicket.customer_id);

  if (!findTicket)
    return res
      .status(404)
      .json({ success: false, payload: `invalid ticket is ${ticketId}` });
  // checks if user is an admin

  if (ticketId && req.user.user_type === 3) {
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
    res.status(200).json({ success: true, payload: adminUpdatedTicket });
  } else if (
    findTicket.customer_id === req.user.id &&
    req.user.user_type === 0
  ) {
    const userUpdatedTicket = await TicketModel.updateOne(query, {
      ticket_type,
      title,
      description,
      attachment,
    });
    res.status(200).json({
      success: true,
      payload: userUpdatedTicket,
    });
  } else {
    res.status(400).json({
      success: false,
      payload: 'you can not update this ticket ',
    });
  }
});

// admin controllers
const listTicket = asyncWrapper(async (req, res) => {
  const getAllTickets = await TicketModel.find();
  let agentTickets = [];
  let activeAgentTickets = [];
  let inactiveAgentTickets = [];
  let deptTickets = [];
  let activeTickets = [];
  let inActiveTickets = [];
  let deptActiveTickets = [];
  let deptInactiveTickets = [];
  let urgentTickets = [];
  let activeUnassignedTickets = [];
  let inactiveUnassignedTickets = [];
  let unassignedTickets = [];
  getAllTickets.forEach((element, idx) => {
    if (element.assignee_id !== null) {
      agentTickets.push(element);
      if (element.ticket_status === 'active') {
        activeAgentTickets.push(element);
      } else {
        inactiveAgentTickets.push(element);
      }
    } else if (element.dept_id !== null) {
      deptTickets.push(element);
      if (element.ticket_status === 'active') {
        deptActiveTickets.push(element);
      } else {
        deptInactiveTickets.push(element);
      }
    } else {
      unassignedTickets.push(element);
      if (element.ticket_status === 'active') {
        activeUnassignedTickets.push(element);
      } else {
        inactiveUnassignedTickets.push(element);
      }
    }
  });

  getAllTickets.forEach((element, idx) => {
    if (element.ticket_status === 'active') {
      activeTickets.push(element);
    } else {
      inActiveTickets.push(element);
    }
  });
  // getAllTickets.forEach((element, idx) => {
  //   if (element.urgency === 'urgent') {
  //     urgentTickets.push(element);
  //     if (element.ticket_status === 'active') {
  //       activeUrgentTickets.push(element);
  //     } else {
  //       inactiveUrgentTickets.push(element);
  //     }
  //   }
  // });

  res.render('Admin/tickets', {
    user: req.user[0],
    success: true,
    receivedTickets: getAllTickets,
    agentTicketCount: agentTickets ? agentTickets.length : 0,
    activeAgentTicketsCount: activeAgentTickets ? activeAgentTickets.length : 0,
    inactiveAgentTicketsCount: inactiveAgentTickets
      ? inactiveAgentTickets.length
      : 0,
    deptTicketCount: deptTickets ? deptTickets.length : 0,
    totalTickets: getAllTickets ? getAllTickets.length : 0,
    activeTickets: activeTickets ? activeTickets.length : 0,
    inactiveTickets: inActiveTickets ? inActiveTickets.length : 0,
    deptActiveTicketCount: deptActiveTickets ? deptActiveTickets.length : 0,
    deptInactiveTicketCount: deptInactiveTickets
      ? deptInactiveTickets.length
      : 0,
    unassignedTickets: unassignedTickets ? unassignedTickets.length : 0,
    activeUnassignedTickets: activeUnassignedTickets
      ? activeUnassignedTickets.length
      : 0,
    inactiveUnassignedTickets: inactiveUnassignedTickets
      ? inactiveUnassignedTickets.length
      : 0,
  });
});
// *GETS ALL TICKETS
const activeTickets = asyncWrapper(async (req, res, next) => {
  let ticketOwners = [];
  const getActiveTickets = await TicketModel.find({ ticket_status: 'active' });
  console.log('...........qwerty..................1');

  for (let index = 0; index < getActiveTickets.length; index++) {
    let ticketUser = await UserModel.find({
      _id: getActiveTickets[index].customer_id,
    });
    ticketOwners.push({
      first_name: ticketUser[0].first_name,
      last_name: ticketUser[0].last_name,
    });
  }
  console.log('...........qwerty..................2');

  // console.log(getActiveTickets);

  // if (ticketOwners.length > 0) {
  // console.log(ticketOwners);
  // }
  res.render('Admin/tickets', {
    user: req.user[0],
    receivedTickets: getActiveTickets,
    ticketOwners: ticketOwners,
  });
});

const cancelledTickets = asyncWrapper(async (req, res, next) => {
  let cancelledOwners = [];
  const getCancelledTickets = await TicketModel.find({
    ticket_status: 'cancelled',
  });

  for (let index = 0; index < getCancelledTickets.length; index++) {
    let ticketUser = await UserModel.find({
      _id: getCancelledTickets[index].customer_id,
    });

    cancelledOwners.push({
      first_name: ticketUser[0].first_name,
      last_name: ticketUser[0].last_name,
    });
  }
  // console.log(ticketOwners);
  // }
  res.render('Admin/tickets', {
    user: req.user[0],
    receivedTickets: getCancelledTickets,
    ticketOwners: cancelledOwners,
  });
});
// in progress tickets
const inProgressTickets = asyncWrapper(async (req, res, next) => {
  let ticketOwners = [];
  const inProgressTickets = await TicketModel.find({
    ticket_status: 'in progress',
  });

  for (let index = 0; index < inProgressTickets.length; index++) {
    let ticketUser = await UserModel.find({
      _id: inProgressTickets[index].customer_id,
    });

    ticketOwners.push({
      first_name: ticketUser[0].first_name,
      last_name: ticketUser[0].last_name,
    });
  }
  // console.log(ticketOwners);
  // }
  res.render('Admin/tickets', {
    user: req.user[0],
    receivedTickets: inProgressTickets,
    ticketOwners: ticketOwners,
  });
});
// pending tickets
const pendingTickets = asyncWrapper(async (req, res, next) => {
  let ticketOwners = [];
  const getPendingTickets = await TicketModel.find({
    ticket_status: 'pending',
  });

  for (let index = 0; index < getPendingTickets.length; index++) {
    let ticketUser = await UserModel.find({
      _id: getPendingTickets[index].customer_id,
    });

    ticketOwners.push({
      first_name: ticketUser[0].first_name,
      last_name: ticketUser[0].last_name,
    });
  }
  // console.log(ticketOwners);
  // }
  res.render('Admin/tickets', {
    user: req.user[0],
    receivedTickets: getPendingTickets,
    ticketOwners: ticketOwners,
  });
});
// resolved tickets
const resolvedTickets = asyncWrapper(async (req, res, next) => {
  let ticketOwners = [];
  const getResolvedTickets = await TicketModel.find({
    ticket_status: 'resolved',
  });

  for (let index = 0; index < getResolvedTickets.length; index++) {
    let ticketUser = await UserModel.find({
      _id: getResolvedTickets[index].customer_id,
    });

    ticketOwners.push({
      first_name: ticketUser[0].first_name,
      last_name: ticketUser[0].last_name,
    });
  }
  // console.log(ticketOwners);
  // }
  res.render('Admin/tickets', {
    user: req.user[0],
    receivedTickets: getResolvedTickets,
    ticketOwners: ticketOwners,
  });
});

// deletes ticket
const deleteTicket = asyncWrapper(async (req, res, next) => {
  const deleteMessage = (deleteTicket) => {
    if (deleteTicket.deletedCount) {
      res.status(200).json({
        success: true,
        payload: 'ticket was deleted successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        payload: 'cannot delete ticket ',
      });
    }
  };
  // checks is user is authenticated
  verifyUser(req, res);
  const ticketId = req.params.ticketId;
  const { id, user_type } = req.user;
  // console.log();
  if (user_type === 3) {
    const deleteTicket = await TicketModel.deleteOne({
      _id: req.params.ticketId,
    });
    return deleteMessage(deleteTicket);
  }
  // req.body.customer_id is gotten from the application state
  // ie if the user clicks a ticket the customer_id  will be retrieved from the ticket

  if (user_type === 0 && id === req.body.customer_id) {
    const deleteTicket = await TicketModel.deleteOne({
      customer_id: req.body.customer_id,
    });
    // console.log(deleteTicket);

    return deleteMessage(deleteTicket);
  }

  next(
    createCustomError('you sre not authorized to perform this operation', 400)
  );
});

const adminCreateTicket = asyncWrapper(async (req, res) => {
  const {
    ticket_type,
    title,
    customer_id,
    assignee_id,
    dept_id,
    urgency,
    priority,
    ticket_status,
    description,
  } = req.body;

  if (
    !ticket_type ||
    !title ||
    !customer_id ||
    !urgency ||
    !priority ||
    !ticket_status ||
    !description
  )
    return res.send({
      success: false,
      msg: 'Inputs fields marked with *, cannot be empty!',
    });

  if (!assignee_id && dept_id === 'none')
    return res.send({
      success: false,
      msg: 'You Must Choose Assignee Or Department Field',
      payload: {
        ticket_type,
        title,
        customer_id,
        assignee_id,
        dept_id,
        urgency,
        priority,
        ticket_status,
        description,
      },
    });

  /**
   * @param all parameter are of type String and are validated before passed as arg
   * * This function is responsible for creating ticket with respect to provided args
   */
  const createTicketFn = async (
    addDept,
    _ticket_type,
    _title,
    _customer_id,
    _assignee_id,
    _dept_id,
    _urgency,
    _priority,
    _ticket_status,
    _description
  ) => {
    const createTicketInfo = {
      ticket_type: _ticket_type,
      title: _title,
      customer_id: _customer_id,

      urgency: _urgency,
      priority: _priority,
      ticket_status: _ticket_status,
      description: _description,
    };
    // *checks if user entered both assignee and department
    if (_dept_id !== 'none' && _assignee_id)
      return res.send({
        success: false,
        msg: 'Please Select Either An Assignee Or Department',
      });
    // this changes the values of dept_id and assignee_id based on the conditions below
    createTicketInfo.dept_id = _dept_id === 'none' ? null : _dept_id;
    createTicketInfo.assignee_id = !_assignee_id ? null : _assignee_id;
    console.log('ooooooo');
    console.log(createTicketInfo);
    //*creates a new instance of the ticket model
    const newTicket = new TicketModel(createTicketInfo);
    const storedTicket = await newTicket.save();
    // sends created ticket and a success msg
    console.log(storedTicket);
    return res.send({
      success: true,
      msg: 'Ticket Has Been Created !',
      payload: storedTicket,
    });
  };
  //* email validation start
  const { error: customerValError } = await validateEmail({
    email: customer_id,
  });
  const { error: agentValError } = await validateEmail({ email: assignee_id });
  // console.log(customerValError, agentValError);

  // * Email validation end

  // *Checks if error was returned from the validation
  if (customerValError)
    return res.send({ success: false, msg: customerValError.message });
  // if(assignee_id)
  if (assignee_id && agentValError)
    return res.send({ success: false, msg: agentValError.message });

  // *fetch customer  with the provided email
  const getUserInfo = await userModel.findOne(
    { email: customer_id },
    { password: 0 }
  );

  // *fetch Agent  with the provided email ie if email is provided
  const getAssigneeInfo = await userModel.findOne(
    { email: assignee_id },
    { password: 0 }
  );

  // *check if customer and agent exist in th DB
  if (!getUserInfo)
    return res.send({
      success: false,
      msg: `This customer ${customer_id} does not exist,Please create account for this customer`,
    });
  if (assignee_id && !getAssigneeInfo)
    return res.send({
      success: false,
      msg: `Agent ${assignee_id} does not exist!`,
    });

  // *Checks if assignee is a customer
  if (getAssigneeInfo && getAssigneeInfo.user_type === 0)
    return res.send({
      success: false,
      msg: "You Can't Assign Ticket To A Customer ",
    });
  if (dept_id) {
    createTicketFn(
      true,
      ticket_type,
      title,
      customer_id,
      assignee_id, //remove
      dept_id,
      urgency,
      priority,
      ticket_status,
      description
    );
  } else {
    createTicketFn(
      false,
      ticket_type,
      title,
      customer_id,
      assignee_id,
      dept_id,
      urgency,
      priority,
      ticket_status,
      description
    );
  }

  // createTicketFn()

  // console.log(getUserInfo);
  // console.log(getUserInfo);
});

module.exports = {
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
};

// assigning ticket to agent or dept should be optional
