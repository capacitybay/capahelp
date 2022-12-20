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
const userModel = require('../../models/userModel');

// admin display
/**
 * *This function populates the cards in admin dashboard
 */
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
  // filters fetched tickets by checking if the ticket is assigned or not
  allTickets.forEach((element) => {
    if (element.assignee_id) {
      assignedTickets.push(element);
    } else {
      unassignedTickets.push(element);
    }
  });
  // custom function that pushes element to different arrays(based on the arguements recieved)
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
      // console.log(element);
    }
  });
  // filters ticket state
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
      // console.log(element);
    }
  });

  // console.log(allTickets);
  /**
   * TODO: work on this (activatedUsers and deactivatedUsers), should  be fetch once and filter
   */
  // filters activeUsers
  const activeUsers = await UserModel.find({
    $and: [{ active: true }, { user_type: 0 }],
  });

  const deactivatedUsers = await UserModel.find({
    $and: [{ active: false }, { user_type: 0 }],
  });
  const allUsers = await UserModel.find({ user_type: 0 });
  //  renders data to the dashboard
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
  // gets information from request body
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    confirmPassword,
    location,
  } = req.body;
  // selects important information
  const validateData = {
    first_name,
    last_name,
    email,
    phone,
    password: password,
  };
  // error temporary storage
  let errors = [];
  // sends some important information to joi validator FACADE

  const { error } = registerValidation(validateData);
  // checks if the validation return error
  if (error) {
    errors.push({ msg: error.message });
  }
  // checks if validated password == confirm password
  if (password != confirmPassword) {
    errors.push({ msg: 'password does not match' });
  }
  if (errors.length > 0) {
    // sends error and data if errors id not null
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
      // hashes user password before storing in DB
      const encryptedPassword = await hashedPassword(password);
      // creates new document
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
      /**
       * TODO: savedUser not doing anything
       */
      // sets message to connect flash
      req.flash('success_msg', 'Registration Successful, you can now login');
      // redirects user to login page
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
  // validates important information
  const validateData = { first_name, last_name, email, phone, password };
  let errors = [];
  const { error } = registerValidation(validateData);
  // checks if the validation return error
  if (error) {
    errors.push({ msg: error.message });
  }
  // verifies password equality
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
    //  checks if email is already available in the system
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
      // converts user_type from strings to system numbers
      const userRole =
        user_type === 'admin' ? 3 : user_type === 'agent' ? 1 : 0;
      // create new document
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
      // sets message to connect flash

      req.flash('success_msg', 'Registration Successful, user can now login');
      // redirects admin to dashboard

      res.status(200).redirect('/admin/dashboard');
    }

    // }
  }
  // console.log(CustomerModel);
});
/**
 * * i'm still working on this
 */
const filterUsersTable = async (arg1, arg2, arg3, ...arg4) => {
  // default single
  // console.log(arg1, arg2, arg3, arg4[0], arg4[1], arg4[2]);
  let searchResult;
  arg2 =
    arg2 === 'admin' ? 3 : arg2 === 'agent' ? 1 : arg2 === 'user' ? 0 : 'all';
  console.log(arg2);
  if ((arg1 || arg2 || arg3) && !arg4[0] && !arg4[1] && !arg4[2]) {
    const tfArg1 = arg1 ? arg1 : undefined;
    const tfArg2 = arg2 === 'all' ? undefined : arg2;
    const tfArg3 = arg3 ? arg3 : undefined;

    const filteredUsers = await UserModel.find({
      $or: [{ email: tfArg1 }, { user_type: tfArg2 }, { location: tfArg3 }],
    });
    searchResult = filteredUsers;
  } else if (!arg4[0] || !arg4[1] || !arg4[2]) {
    const verifyInput = arg4[0]
      ? 'email'
      : arg4[1]
      ? 'user_type'
      : arg4[2]
      ? 'location'
      : undefined;
    console.log('.........................');
    console.log(arg4);
    console.log(verifyInput);
    if (verifyInput === 'email') {
      const singleFiltered = await userModel.find({ email: arg1 });
      searchResult = singleFiltered;
    } else if (verifyInput === 'user_type') {
      let newArg2 = arg2 === 'all' ? undefined : arg2;
      const singleFiltered = await userModel.find({ user_type: newArg2 });
      searchResult = singleFiltered;
    } else if (verifyInput === 'location') {
      const singleFiltered = await userModel.find({ location: arg3 });
      searchResult = singleFiltered;
    } else {
      console.log('no result to display for the search');
    }
  }

  return searchResult;
};
/**
 * TODO: development still inprogress
 */
const filterUsers = asyncWrapper((req, res) => {
  console.log(req.body);
  // filterUsersTable(req.body.email, req.body.user_type, req.body.location);
  const data = req.body;
  console.log({ ...req.body });
  filterUsersTable(
    data.email,
    data.user_type,
    data.location,
    data.emailRadio,
    data.userTypeRadio,
    data.forLocationRadio
  ).then((data) => {
    console.log(data);
    console.log(data.length);
    res.render('Admin/users', {
      users: data,
      hits: data.length,
    });
  });
  // Password123*
});

// get all user  : this  can only be done by the admin
const getUser = asyncWrapper(async (req, res, next) => {
  const loggedUser = req.user;

  if (loggedUser[0].user_type === 3) {
    const getUsers = await UserModel.find({}, { password: 0 });
    if (!getUsers) return next(createCustomError('no user found', 404));
    res.render('Admin/users', {
      users: getUsers,
      hits: getUsers.length,
    });
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

const adminUpdateProfile = asyncWrapper(async (req, res) => {
  console.log(req.user);
  const user = req.user[0];

  res.render('Admin/editProfile', {
    user: user,
    // first_name: user.first_name,
    // last_name: user.last_name,
    // email: user.email,
    phoneNo: +user.phone,
  });
});

// !this controller updates (admin/agent/customer) profile

const updateProfile = asyncWrapper(async (req, res) => {
  console.log(req.body);
  const { first_name, last_name, email, phone, location } = req.body;

  const userId = req.params.userId;
  if (!first_name || !last_name || !email || !phone || !location)
    return res.send({
      success: false,
      msg: 'Input field(s) must not be empty',
    });
  /**
   * TODO: write a logic to check email
   *
   */

  const updatedUser = await userModel.findOneAndUpdate(
    { _id: req.user[0]._id },
    { first_name: first_name, last_name: last_name, phone: phone, location },
    { new: true }
  );

  console.log(updatedUser);
  // req.flash('success_msg', 'Your Profile has been updated');
  res.send({ success: true, msg: 'Your Profile has been updated' });
  // return res.render('Admin/editProfile', {
  //   user: updatedUser,
  // });
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
  const { first_name, last_name, email, phone, location, gender, state, role } =
    req.body;

  const { id, user_type } = req.user[0];
  // const userId = req.params.userId;
  if (user_type === 3) {
    const validateData = {
      first_name,
      last_name,
      email,
      phone,
    };

    let errors = [];

    const { error } = updateUserValidation(validateData);

    if (error) {
      errors.push({ msg: error.message });
    }
    console.log('ooooooooooooooooooooo0');

    if (errors.length > 0) {
      console.log(
        errors,
        first_name,
        last_name,
        email,
        phone,
        location,
        gender,
        state,
        req.params
      );
      console.log('ooooooooooooooooooooo1');

      res.render('Admin/editUser.ejs', {
        errors,
        first_name,
        last_name,
        email,
        phone,
        location,
        gender,
        state,
        user: undefined,
        id: req.params.userId,
        feedback: false,
      });
    } else {
      // Password123*

      const findUser = await UserModel.findOne({ email: email });

      if (findUser) {
        console.log('ooooooooooooooooooooo3');

        console.log('...........qwerty.........');
        errors.push({
          msg: `you can't use this email  ${email}, please try another email`,
        });
        res.render('Admin/editUser.ejs', {
          errors,
          first_name,
          last_name,
          email,
          phone,
          location,
          gender,
          state,
          user: undefined,
          id: req.params.userId,
          feedback: false,
        });

        // return res.status(400).json(` `);
      } else {
        // updates the user
        const convertStateToBool = state === 'activate' ? true : false;
        const convertRole = role === 'admin' ? 3 : role === 'agent' ? 1 : 0;
        const updatedUser = await UserModel.findOneAndUpdate(
          { _id: req.params.userId },
          {
            first_name,
            last_name,
            email,
            phone,
            location,
            gender,
            active: convertStateToBool,
            user_type: convertRole,
          },
          { new: true }
        );
        console.log(updatedUser);
        if (updatedUser) {
          // req.flash('success_msg', 'Account Has been updated!');

          res.status(200).render('Admin/editUser', {
            user: updatedUser,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            location: updatedUser.location,
            gender: updatedUser ? updatedUser.gender : '',
            id: updatedUser._id,
            feedback: {
              updated: true,
              msg: 'Account Has been updated!',
            },
          });
        } else {
          req.flash('error_msg', ` OOps!, something went wrong`);
          res.render('Admin/editUser', {
            user: undefined,
            first_name: updatedUser.first_name,
            last_name: updatedUser.last_name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            location: updatedUser.location,
            gender: updatedUser ? updatedUser.gender : '',
            id: updatedUser._id,
            feedback: false,
          });
        }
      }
    }
  } else {
    // TODO: work on this

    req.flash('error_msg', ` you are not authorized to update this customer `);
    res.render('Admin/editUser', {
      user: undefined,
      first_name: updatedUser.first_name,
      last_name: updatedUser.last_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      location: updatedUser.location,
      gender: updatedUser ? updatedUser.gender : '',
      id: updatedUser._id,
      feedback: false,
    });
  }
});
// deactivate user

const deactivateUser = asyncWrapper(async (req, res) => {
  if (req.user[0].user_type === 3) {
    // updates and return updated user
    const blockUser = await UserModel.findOneAndUpdate(
      { _id: req.params.userId },
      {
        active: false,
      },
      { new: true }
    );

    if (blockUser) {
      req.flash(
        'success_msg',
        ` ${blockUser.first_name.toUpperCase()} ${blockUser.last_name.toUpperCase()}'s Account  Deactivated!`
      );
      // renders message to frontend
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
  if (req.user[0].id === req.params.userId || req.user[0].user_type === 3) {
    const deletedUser = await UserModel.findOneAndDelete(
      { _id: req.params.userId },
      { new: true }
    );
    if (deletedUser) {
      req.flash(
        'success_msg',
        `${deletedUser.first_name} ${deletedUser.first_name}  deleted successfully`
      );
      // redirects user to the initial url
      res.redirect(303, req.get('referer'));
    }
  } else {
    /**
     * TODO: fix this with a pop up modal
     */
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
  adminUpdateProfile,
  updateProfile,
};
