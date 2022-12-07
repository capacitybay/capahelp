const TicketModel = require('../../models/ticketModel');
const asyncWrapper = require('../../middleware/controllerWrapper');
const { createCustomError } = require('../../middleware/customError');
const { find, findOne } = require('../../models/departmentModel');
const { resolveHostname } = require('nodemailer/lib/shared');
const UserModel = require('../../models/userModel');
// const { findOne } = require('../../models/departmentModel');

const verifyUser = (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, payload: 'You are not authenticated' });
};
const createTicket = asyncWrapper(async (req, res) => {
  console.log(req.user);

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

// gets a single ticket

const getTicket = asyncWrapper(async (req, res, next) => {
  // if (!req.user)
  //   return res
  //     .status(401)
  //     .json({ success: false, payload: 'You are not authenticated' });

  //
  if (req.user[0].user_type === 3) {
    const ticket = await TicketModel.findOne({ _id: req.params.ticketId });
    if (!ticket) return next(createCustomError('no ticket found!', 404));

    // let ticketOwners = [];

    let ticketUser = await UserModel.find({
      _id: ticket.customer_id,
    });
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
  console.log(findTicket.customer_id);

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
  const checkTickets = (tickets, ticketOwners, role) => {
    if (!tickets) {
      return res
        .status(404)
        .json({ success: false, payload: 'No ticket found!' });
    } else {
      if (role === 3) {
        res.render('Admin/tickets', {
          user: req.user[0],
          success: true,
          payload: tickets,
          hits: tickets.length,
          receivedTickets: tickets,
          ticketOwners: ticketOwners,
        });
      } else if (role === 0) {
        // this will render user ticket page (not activated yet)
        res.render('Admin/tickets', {
          user: req.user[0],
          success: true,
          payload: tickets,
          hits: tickets.length,
          receivedTickets: tickets,
          ticketOwners: ticketOwners,
        });
      }

      // return res.status(200).json({
      //   success: true,
      //   payload: tickets,
      //   hits: tickets.length,
      // });
    }
  };

  // checks is user is authenticated
  // verifyUser(req, res);

  const { id, user_type } = req.user[0];
  
  if (user_type === 3) {
    let ticketOwners = [];
    const tickets = await TicketModel.find();
    for (let index = 0; index < tickets.length; index++) {
      let ticketUser = await UserModel.find({
        _id: tickets[index].customer_id,
      });
      // console.log(ticketUser);

      ticketOwners.push({
        first_name: ticketUser[0] ? ticketUser[0].first_name : 'No user ',
        last_name: ticketUser[0] ? ticketUser[0].last_name : ' found',
      });
    }
    checkTickets(tickets, ticketOwners, user_type);
  }
  if (user_type === 0) {
    // not tested
    let ticketOwners = [];
    const tickets = await TicketModel.find({ customer_id: id });
    for (let index = 0; index < tickets.length; index++) {
      let ticketUser = await UserModel.find({
        _id: tickets[index].customer_id,
      });

      ticketOwners.push({
        first_name: ticketUser[0] ? ticketUser[0].first_name : 'No user ',
        last_name: ticketUser[0] ? ticketUser[0].last_name : 'found',
      });
    }
    checkTickets(tickets, ticketOwners, user_type);
  }
});

const activeTickets = asyncWrapper(async (req, res, next) => {
  let ticketOwners = [];
  const getActiveTickets = await TicketModel.find({ ticket_status: 'active' });

  for (let index = 0; index < getActiveTickets.length; index++) {
    let ticketUser = await UserModel.find({
      _id: getActiveTickets[index].customer_id,
    });

    ticketOwners.push({
      first_name: ticketUser[0].first_name,
      last_name: ticketUser[0].last_name,
    });
  }

  // if (ticketOwners.length > 0) {
  console.log(ticketOwners);
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
};
