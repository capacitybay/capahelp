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

  const activeCustomers = await UserModel.find({
    $and: [{ active: true }, { user_type: 0 }],
  });

  const deactivatedCustomers = await UserModel.find({
    $and: [{ active: false }, { user_type: 0 }],
  });
  const totalCustomers = [...activeCustomers, ...deactivatedCustomers];
  // const allUsers = await UserModel.find({ user_type: 0 });
  //  renders data to the dashboard
  res.render('Admin/adminDashboard.ejs', {
    user: req.user[0],
    allTickets: allTickets,
    activeTickets: active ? active.length : 0,
    resolvedTickets: resolved ? resolved.length : 0,
    cancelledTickets: cancelled ? cancelled.length : 0,
    pendingTickets: pending ? pending.length : 0,
    ticketsInProgress: inProgress ? inProgress.length : 0,
    activeCustomers: activeCustomers ? activeCustomers.length : 0,
    deactivatedCustomers: deactivatedCustomers
      ? deactivatedCustomers.length
      : 0,
    totalCustomers: totalCustomers.length,
    allUsersData: totalCustomers ? totalCustomers : 0,

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
    const allSystemUsers = await UserModel.find({}, { password: 0 });
    const addElements = (array, element) => {
      array.push(element);
    };
    let deactivatedAdmins = [],
      deactivatedAgents = [],
      deactivatedCustomers = [],
      admins = [],
      agents = [],
      customers = [];

    allSystemUsers.forEach((element, idx) => {
      if (element.user_type === 3) {
        addElements(admins, element);
      } else if (element.user_type === 1) {
        addElements(agents, element);
      } else if (element.user_type === 0) {
        addElements(customers, element);
      }
    });

    allSystemUsers.forEach((element, idx) => {
      if (!element.active && element.user_type === 3) {
        addElements(deactivatedAdmins, element);
      } else if (!element.active && element.user_type === 1) {
        addElements(deactivatedAgents, element);
      } else if (!element.active && element.user_type === 0) {
        addElements(deactivatedCustomers, element);
      }
    });

    const getUsers = await UserModel.find({}, { password: 0 });
    const totalInactiveUsers =
      deactivatedAdmins.length +
      deactivatedAgents.length +
      deactivatedCustomers.length;
    console.log('.......');
    console.log(totalInactiveUsers);

    if (!getUsers) return next(createCustomError('no user found', 404));
    res.render('Admin/users', {
      users: getUsers,
      hits: getUsers.length,
      totalSystemUsers: allSystemUsers ? allSystemUsers.length : 0,
      totalAdmins: admins ? admins.length : 0,
      inactiveAdmins: deactivatedAdmins ? deactivatedAdmins.length : 0,
      activeAdmins: deactivatedAdmins
        ? admins.length - deactivatedAdmins.length
        : 0,
      totalInactiveUsers: totalInactiveUsers ? totalInactiveUsers : 0,
      activeUsers: totalInactiveUsers
        ? allSystemUsers.length - totalInactiveUsers
        : 0,
      deactivatedCustomers: deactivatedCustomers
        ? deactivatedCustomers.length
        : 0,
      activeCustomers: customers
        ? customers.length - deactivatedCustomers.length
        : 0,
      customers: customers ? customers.length : 0,
      agents: agents ? agents.length : 0,
      activeAgents: agents ? agents.length - deactivatedAgents.length : 0,
      inactiveAgents: agents ? deactivatedAgents.length : 0,
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
/**
 * * this renders admin profile (GET REQUEST)
 */
const adminUpdateProfile = asyncWrapper(async (req, res) => {
  const user = req.user[0];

  res.render('Admin/editProfile', {
    user: user,
    phoneNo: +user.phone,
  });
});

/**
 ** UPDATE USER PROFILE CONTROLLER
 *!: STRICTLY FOR ADMIN USER
 *? this controller updates (admin/agent/customer) profile
 */
const updateProfile = asyncWrapper(async (req, res) => {
  const { first_name, last_name, email, phone, location, checkEmail } =
    req.body;

  const updateProfile = async () => {
    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.user[0]._id },
      {
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        location,
      },
      { new: true }
    );

    res.send({ success: true, msg: 'Your Profile has been updated' });
  };

  const userId = req.params.userId;
  if (!first_name || !last_name || !email || !phone || !location)
    return res.send({
      success: false,
      msg: 'Input field(s) must not be empty',
    });

  if (checkEmail) {
    const findUser = await userModel.find({ email: email }, { password: 0 });

    if (email === req.user[0].email)
      return res.send({
        success: false,
        msg: 'You are already using this email; if you would like to update it, please check the box.',
      });

    if (email !== req.user[0].email) {
      // checks if passed email equals retrieved user email
      if (email === findUser[0].email) {
        return res.send({
          success: false,
          msg: 'Sorry, you cannot use this email',
        });
      } else {
        updateProfile();
      }
    }
  } else {
    updateProfile();
  }
});

/**
 ** update user route
 *!: Strictly for admin
 */
const updateUser = asyncWrapper(async (req, res, next) => {
  // validates the provided fields
  const {
    first_name,
    last_name,
    email,
    phone,
    location,
    gender,
    state,
    role,
    selectEmail,
  } = req.body;

  /**
   ** updates acct if email check box returns true or false
   * @params : checkEmail=checkbox,userState:active/inactive,userRole=admin/user/agent,userEmail=email
   */
  const updateUserFn = async (
    checkEmail,
    userState,
    userRole,
    userEmail,
    phone,
    first_name,
    last_nam
  ) => {
    const convertStateToBool = userState === 'activate' ? true : false;
    const convertRole = userRole === 'admin' ? 3 : userRole === 'agent' ? 1 : 0;
    const query = {
      first_name,
      last_name,
      phone,
      location,
      gender,
      active: convertStateToBool,
      user_type: convertRole,
    };
    // checks id email check box is checked
    if (checkEmail) {
      // adds email property
      query.email = userEmail;
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.params.userId },
        query,
        { new: true }
      );
      return updatedUser;
    } else {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: req.params.userId },
        query,
        { new: true }
      );
      return updatedUser;
    }
  };
  const { id, user_type } = req.user[0];

  // validates if logged user is admin
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
    const renderInterface = async (status, userInfo) => {
      if (!status) {
        const getUserData = await userModel.find({ _id: req.params.userId });

        return res.render('Admin/editUser.ejs', {
          errors,
          user: getUserData[0],
          id: req.params.userId,
          feedback: { success: false },
        });
      } else {
        return res.status(200).render('Admin/editUser', {
          user: userInfo,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name,
          email: userInfo.email,
          phone: userInfo.phone,
          location: userInfo.location,
          gender: userInfo ? userInfo.gender : '',
          id: userInfo._id,
          feedback: {
            updated: true,
            msg: `${userInfo.first_name} ${userInfo.last_name}'s Account Has been updated!`,
          },
        });
      }
    };

    // start
    if (errors.length > 0) {
      renderInterface(false);
    } else {
      console.log('------tttttttttttttt---------');
      // finds user with the provided email
      const findUser = await UserModel.findOne(
        { email: email },
        { password: 0 }
      );
      // check if email checkbox is selected
      console.log('first');
      console.log(!selectEmail);
      if (selectEmail) {
        if (findUser) {
          errors.push({
            msg: 'You are already using this email; if you would like to update it, please check the box.',
          });
          // renders interface with error array
          renderInterface(false);
        } else {
          // updates the user
          const userInfo = await updateUserFn(
            true,
            state,
            role,
            email,
            phone,
            first_name,
            last_name
          );

          if (userInfo) {
            // render updated user information
            renderInterface(true, userInfo);
          } else {
            // renders error if anything went wrong in the DB
            errors.push({ msg: ` OOps!, something went wrong` });
            renderInterface(false);
          }
        }
      } else {
        // this will update account without updating the email
        console.log('last');
        console.log(findUser);
        if (findUser && findUser.email !== email) {
          // renders error if user enters an already registered email

          errors.push({
            msg: `you can't use this email  ${email}, please try another email`,
          });
          renderInterface(false);
        } else {
          // updates user if email check box was not checked
          const userInfo = await updateUserFn(
            false,
            state,
            role,
            email,
            phone,
            first_name,
            last_name
          );

          renderInterface(true, userInfo);
        }
      }
    }
  } else {
    // TODO: work on this

    req.flash('error_msg', ` you are not authorized to update this customer `);
    errors.push({
      msg: ` you are not authorized to update this customer `,
    });
    renderInterface(false);
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
      // TODO:this will return an error dialog
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

// !Admin routes

const viewUserProfile = asyncWrapper(async (req, res) => {
  const userData = await userModel.findOne(
    { email: req.params.email },
    { password: 0 }
  );
  console.log(userData);
  res.render('Admin/viewUserProfile', {
    user: req.user[0],
    userData: userData,
  });
});

const getAdminCreateUser = asyncWrapper((req, res) => {
  return res.render('Admin/adminCreateUser.ejs', {
    message: null,
    email: null,
  });
  // return
});
const getAdminUpdateUserProfile = asyncWrapper(async (req, res) => {
  const user = await userModel.find(
    { _id: req.params.userId },
    { password: 0 }
  );
  console.log('user');
  console.log(user);
  res.render('Admin/editUser', { user: user[0], feedback: false });
});
const getRegisterComponent = asyncWrapper((req, res) => {
  res.render('Admin/adminCreateUser');
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

  viewUserProfile,
  getAdminCreateUser,
  getAdminUpdateUserProfile,
  getRegisterComponent,
};
