const UserModel = require('../../models/userModel');
const TicketModel = require('../../models/ticketModel');
const { hashedPassword } = require('../../auth/password');
const {
  registerValidation,
  updateUserValidation,
} = require('../../validation/validation');
//
const asyncWrapper = require('../../middleware/controllerWrapper');
const {
  createCustomError,
  CustomError,
} = require('../../middleware/customError');
const RefreshTokenModel = require('../../models/refreshTokenModel');

// admin display

const adminDashboard = asyncWrapper(async (req, res) => {
  // console.log(req.user);
  const allTickets = await TicketModel.find();
  let active = [],
    pending = [],
    resolved = [],
    inProgress = [],
    cancelled = [];

  let urgent = [],
    low = [],
    high = [],
    medium = [],
    open = [];
  // assigned and unassigned tickets
  let assignedTickets = [],
    unassignedTickets = [];

  allTickets.forEach((element) => {
    if (element.assignee_id) {
      assignedTickets.push(element);
    } else {
      unassignedTickets.push(element);
    }
  });

  const addElements = (array, element) => {
    array.push(element);
  };
  allTickets.forEach((element, idx) => {
    if (element.ticket_status === 'active') {
      // console.log(element);
      addElements(active, element);
    } else if (element.ticket_status === 'pending') {
      addElements(pending, element);
    } else if (element.ticket_status === 'resolved') {
      addElements(resolved, element);
    } else if (element.ticket_status === 'in progress') {
      addElements(inProgress, element);
    } else if (element.ticket_status === 'cancelled') {
      addElements(cancelled, element);
    } else {
      console.log(element);
    }
  });

  allTickets.forEach((element, idx) => {
    if (element.priority === 'urgent') {
      addElements(urgent, element);
    } else if (element.priority === 'high') {
      addElements(low, element);
    } else if (element.priority === 'low') {
      addElements(high, element);
    } else if (element.priority === 'medium') {
      addElements(medium, element);
    } else if (element.priority === 'open') {
      addElements(open, element);
    } else {
      console.log(element);
    }
  });

  console.log(allTickets);

  const activeUsers = await UserModel.find({
    $and: [{ active: true }, { user_type: 0 }],
  });
  const deactivatedUsers = await UserModel.find({
    $and: [{ active: false }, { user_type: 0 }],
  });
  const allUsers = await UserModel.find({ user_type: 0 });
  // console.log(activeTickets.length);
  res.render('Admin/adminDashboard.ejs', {
    user: req.user[0],
    allTickets: allTickets,
    activeTickets: active ? active.length : 0,
    resolvedTickets: resolved ? resolved.length : 0,
    cancelledTickets: cancelled ? cancelled.length : 0,
    pendingTickets: pending ? pending.length : 0,
    ticketsInProgress: inProgress ? inProgress.length : 0,
    activeUsers: activeUsers ? activeUsers.length : 0,
    deactivatedUsers: deactivatedUsers ? deactivatedUsers.length : 0,
    allUsers: allUsers.length,
    allUsersData: allUsers ? allUsers : 0,

    // ticket priority
    urgentTicket: urgent ? urgent.length : 0,
    highPriorityTicket: high ? high.length : 0,
    mediumPriorityTicket: medium ? medium.length : 0,
    openTickets: open ? open.length : 0,
    // assigned and unassigned tickets
    unassignedTickets: unassignedTickets ? unassignedTickets.length : 0,
    assignedTickets: assignedTickets ? assignedTickets.length : 0,
  });
});

const createUser = asyncWrapper(async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    confirmPassword,
    location,
  } = req.body;
  // checks if payload was sent or checks if th user is logged in
  // let convertPhone = phone.toString();
  // console.log(location);
  const validateData = {
    first_name,
    last_name,
    email,
    phone,
    password: password,
  };
  let errors = [];
  // if (!first_name || !last_name || !email || !password)
  //   return res.redirect('register.ejs');
  const { error } = registerValidation(validateData);
  // checks if the validation return error
  if (error) {
    // req.flash('error_msg', error.message);
    // res.flash('error_msg', error.message);
    // return res.redirect('/api/v1/user/register');
    errors.push({ msg: error.message });
  }
  // status(400).json(error.message);
  if (password != confirmPassword) {
    // return res.status(400).render('register.ejs', {
    //   message: 'password does not match',
    //   email: email,
    // });
    errors.push({ msg: 'password does not match' });
  }
  if (errors.length > 0) {
    res.render('register.ejs', {
      errors,
      first_name,
      last_name,
      email,
      phone,
      password,
      confirmPassword,
      location,
    });
  } else {
    const getUser = await UserModel.findOne({ email: email });
    if (getUser) {
      errors.push({ msg: 'user already exists' });
      res.render('register.ejs', {
        errors,
        first_name,
        last_name,
        email,
        phone,
        password,
        confirmPassword,
        location,
      });
    } else {
      // hashes user password before storing it

      const encryptedPassword = await hashedPassword(password);
      // create new document

      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        password: encryptedPassword,
        phone,
        location,
      });

      // save user to database

      const savedUser = await newUser.save();
      // sends response to the frontend
      const newTokenStore = new RefreshTokenModel({
        user_id: savedUser._id,
      });
      // sets message to connect flash
      req.flash('success_msg', 'Registration Successful, you can now login');
      res.redirect('/login');
    }
  }

  // console.log(CustomerModel);
});
const adminCreateUser = asyncWrapper(async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    user_type,
    confirmPassword,
    location,
  } = req.body;
  // checks if payload was sent or checks if th user is logged in

  const validateData = { first_name, last_name, email, phone, password };
  let errors = [];
  const { error } = registerValidation(validateData);
  // checks if the validation return error
  if (error) {
    errors.push({ msg: error.message });
  }
  if (password != confirmPassword) {
    errors.push({ msg: 'password does not match' });
  }
  if (errors.length > 0) {
    res.render('Admin/register.ejs', {
      errors,
      first_name,
      last_name,
      email,
      phone,
      password,
      confirmPassword,
      location,
    });
  } else {
    // if (!error) {
    const getUser = await UserModel.findOne({ email: email });
    if (getUser) {
      errors.push({ msg: 'user already exists' });
      res.render('register.ejs', {
        errors,
        first_name,
        last_name,
        email,
        phone,
        password,
        confirmPassword,
        location,
      });
    } else {
      // hashes user password before storing it

      const encryptedPassword = await hashedPassword(password);
      // create new document
      const userRole =
        user_type === 'admin' ? 3 : user_type === 'agent' ? 1 : 0;
      console.log(userRole);
      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        password: encryptedPassword,
        phone,
        location,
        user_type: userRole,
      });

      // save user to database
      const savedUser = await newUser.save();
      // sends response to the frontend

      req.flash('success_msg', 'Registration Successful, user can now login');
      res.redirect('/admin/dashboard');

      res.status(200).json({
        success: true,
        payload: savedUser,
      });
    }

    // }
  }
  // console.log(CustomerModel);
});

const filterUsersTable = async (arg1, arg2, arg3) => {
  // default single
  const filteredTwo = [];
  const filteredByAnArg = [];
  if (arg1 || arg2 || arg3) {
    filteredTwo = await UserModel.find({
      $and: [{ arg1: arg1 }, { arg2: arg2 }, { arg3: arg3 }],
    });
  } else if (arg1 & (arg3 === undefined) & (arg2 === undefined)) {
    filteredByAnArg = await UserModel.find({ arg1: arg1 });
  }
};

const filterUsers = asyncWrapper(async (req, res) => {
  console.log(req.body);
});
// get all user  : this  can only be done by the admin

const getUser = asyncWrapper(async (req, res, next) => {
  const loggedUser = req.user;
  // filterUsersTable();
  // console.log(loggedUser);
  // if (!loggedUser)
  //   return res
  //     .status(401)
  //     .json({ success: false, payload: 'you are not authenticated!' });
  if (loggedUser[0].user_type === 3) {
    const getUsers = await UserModel.find({}, { password: 0 });
    if (!getUsers) return next(createCustomError('no user found', 404));
    res.render('Admin/users', {
      users: getUsers,
    });
    // .status(200)
    // .json({ success: true, payload: getUsers, hits: getUsers.length });
  } else {
    next(
      createCustomError(
        'You are not authorized to perform this operation!',
        401
      )
    );
  }
});

// get a user controller

const viewUser = asyncWrapper(async (req, res, next) => {
  const loggedUser = req.user;
  if (!loggedUser)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated!' });

  if (loggedUser.id === req.params.userId || loggedUser.user_type === 3) {
    // get user profile
    const userProfile = await UserModel.findOne(
      { _id: req.params.userId },
      { password: 0 }
    );
    if (!userProfile) return next(createCustomError('user not found', 404));

    res.status(200).json({ success: true, payload: userProfile });
  } else {
    next(
      createCustomError(
        "You're not  authorized to perform this operation!",
        401
      )
    );
  }
});
/**
 * change email logic
 * get email from the application state
 * since  email is from the application state, it is considered verified
 * verify that the entered email doesn't exist in th db
 * const response = findone({email:req.newEmail})
 * if(response) return cannot use this email
 * const update = updateOne({email:req.email})
 * if (response.acknowledge){
res.send()
 * 
 * }
 */
// update users

const updateUser = asyncWrapper(async (req, res, next) => {
  // validates the provided fields
  const { first_name, last_name, email, phone, location, gender } = req.body;
  console.log('req.user');
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated' });
  const { id, user_type } = req.user;
  const userId = req.params.userId;
  if (userId === id || user_type === 3) {
    const validateData = {
      first_name,
      last_name,
      email,
      phone,
      location,
      gender,
    };
    console.log('validateData');
    const { error } = updateUserValidation(validateData);
    console.log('error');
    if (error)
      return res.status(400).json({ success: false, payload: error.message });

    const findUser = await UserModel.findOne({ email: email });

    if (findUser)
      return res
        .status(400)
        .json(`you can't use this email  ${email}, please try another email `);
    // updates the user
    const updatedUser = await UserModel.updateOne(
      { _id: req.params.userId },
      {
        first_name,
        last_name,
        email,
        phone,
        location,
        gender,
      }
    );
    if (updatedUser.acknowledged) {
      res.status(200).json({
        success: true,
        payload: updatedUser,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      payload: 'you are not authorized to update this customer ',
    });
  }
});
// deactivate user

const deactivateUser = asyncWrapper(async (req, res) => {
  // if (!req.user)
  //   return res
  //     .status(401)
  //     .json({ success: false, payload: 'you are not authenticated' });

  if (req.user[0].user_type === 3) {
    const blockUser = await UserModel.findOneAndUpdate(
      { _id: req.params.userId },
      {
        active: false,
      },
      { new: true }
    );
    // Password123*
    // console.log(blockUser);
    if (blockUser) {
      // console.log('yeeeee');
      req.flash(
        'success_msg',
        ` ${blockUser.first_name.toUpperCase()} ${blockUser.last_name.toUpperCase()}'s Account  Deactivated!`
      );

      // res.redirect(`view/user/profile/${blockUser.email}`);

      res.status(200).render(`Admin/viewUserProfile`, { userData: blockUser });
    } else {
      // this will return an error dialog
    }
  } else {
    res.status(401).json({
      success: false,
      payload: 'you are not authorized to deactivate a customer',
    });
  }
});
// delete user

const reactivateUser = asyncWrapper(async (req, res) => {
  console.log(req.params.userId);
  if (req.user[0].user_type === 3) {
    const activateUser = await UserModel.findOneAndUpdate(
      { _id: req.params.userId },
      {
        active: true,
      },
      { new: true }
    );

    if (activateUser) {
      console.log('yeeeee');

      req.flash(
        'success_msg',
        ` ${activateUser.first_name.toUpperCase()} ${activateUser.last_name.toUpperCase()}'s Account  Activated!`
      );

      res
        .status(200)
        .render(`Admin/viewUserProfile`, { userData: activateUser });
    } else {
      // this will return an error dialog if error occurred
    }
  } else {
    res.status(401).json({
      success: false,
      payload: 'you are not authorized to activate a customer',
    });
  }
});

// delete user

const deleteUser = asyncWrapper(async (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated' });
  if (req.user.id === req.params.userId || req.user.user_type === 3) {
    const deletedUser = await UserModel.deleteOne({ _id: req.params.userId });
    if (deletedUser.acknowledged) {
      res.status(200).json({ success: true, payload: deletedUser });
    }
  } else {
    res.status(401).json({
      success: false,
      payload: 'you are not authorized to delete a customer',
    });
  }
});

module.exports = {
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
};
