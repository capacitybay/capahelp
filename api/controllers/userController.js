const UserModel = require('../../models/userModel');
const TicketModel = require('../../models/ticketModel');
const { hashedPassword } = require('../../auth/password');
const {
  registerValidation,
  updateUserValidation,
  validateEmail,
} = require('../../validation/validation');
//
const asyncWrapper = require('../../middleware/controllerWrapper');
const {
  createCustomError,
  CustomError,
} = require('../../middleware/customError');
const userModel = require('../../models/userModel');

// admin display
/**
 * *This function populates the cards in admin dashboard
 */
const getAdminDashboard = asyncWrapper(async (req, res) => {
  console.log('note authenticatd');

  // gets all ticket in the system
  const allTickets = await TicketModel.find();
  let active = [],
    pending = [],
    resolved = [],
    inProgress = [],
    cancelled = [];
  // ticket priority
  let normalPriority = [],
    highPriority = [],
    lowPriority = [];
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
    if (element.assignee_id || element.dept_id) {
      assignedTickets.push(element);
    } else {
      unassignedTickets.push(element);
    }
  });
  // custom function that pushes element to different arrays(based on the arguments received)
  const addElements = (array, element) => {
    array.push(element);
  };
  allTickets.forEach((element, idx) => {
    if (element.ticket_status === 'active') {
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
  // filters ticket priority
  allTickets.forEach((element, idx) => {
    if (element.priority === 'medium') {
      addElements(normalPriority, element);
    } else if (element.priority === 'high') {
      addElements(highPriority, element);
    } else if (element.priority === 'low') {
      addElements(lowPriority, element);
    } else {
      // console.log(element);
    }
  });
  // filter ticket Urgency
  allTickets.forEach((element, idx) => {
    if (element.urgency === 'urgent') {
      addElements(urgent, element);
    } else if (element.urgency === 'high') {
      addElements(high, element);
    } else if (element.urgency === 'medium') {
      addElements(medium, element);
    } else if (element.urgency === 'open') {
      addElements(open, element);
    } else if (element.urgency === 'low') {
      addElements(low, element);
    }
  });

  // filters activeUsers

  const activeCustomers = [],
    deactivatedCustomers = [];
  const allSystemUsers = await UserModel.find({}, { password: 0 });

  allSystemUsers.forEach((element, idx) => {
    if (element.active && element.user_type === 0) {
      activeCustomers.push(element);
    } else if (!element.active && element.user_type === 0) {
      deactivatedCustomers.push(element);
    }
  });

  const totalCustomers = [...activeCustomers, ...deactivatedCustomers];

  res.render('Admin/adminDashboard.ejs', {
    user: req.user[0],
    allTickets: allTickets,
    activeTickets: active ? active.length : 0,
    resolvedTickets: resolved ? resolved.length : 0,
    cancelledTickets: cancelled ? cancelled.length : 0,
    pendingTickets: pending ? pending.length : 0,
    ticketsInProgress: inProgress ? inProgress.length : 0,
    // customers
    totalCustomers: totalCustomers.length,
    activeCustomers: activeCustomers ? activeCustomers.length : 0,
    deactivatedCustomers: deactivatedCustomers
      ? deactivatedCustomers.length
      : 0,
    allUsersData: allSystemUsers ? allSystemUsers : 0,

    // ticket priority
    normalPriority: normalPriority ? normalPriority.length : 0,
    highPriority: highPriority ? highPriority.length : 0,
    lowPriority: lowPriority ? lowPriority.length : 0,
    //ticket urgency
    urgentTicket: urgent ? urgent.length : 0,
    lowTicketState: low ? low.length : 0,
    mediumUrgencyTicket: medium ? medium.length : 0,
    openTickets: open ? open.length : 0,
    // assigned and unassigned tickets
    unassignedTickets: unassignedTickets ? unassignedTickets.length : 0,
    assignedTickets: assignedTickets ? assignedTickets.length : 0,
  });
});

//* ----------------------------------------------------------------------------------

const userRegistration = asyncWrapper(async (req, res) => {
  // gets information from request body
  const {
    first_name,
    last_name,
    email,
    phone,
    gender,
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
      gender,
      password,
      confirmPassword,
      location,
    });
  } else {
    const getUserDetails = await UserModel.findOne({ email: email });
    if (getUserDetails) {
      errors.push({ msg: "You can't use this email please, try another one " });
      res.render('register.ejs', {
        errors,
        first_name,
        last_name,
        email,
        phone,
        gender,
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
        gender,
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
      req.flash(
        'success_msg',
        `Registration Successful, ${savedUser.first_name.toUpperCase()} you can now login`
      );
      // redirects user to login page
      res.redirect('/login');
    }
  }

  // console.log(CustomerModel);
});
const postAdminCreateUser = asyncWrapper(async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    user_type,
    confirmPassword,
    location,
    gender,
  } = req.body;
  console.log(
    first_name,
    last_name,
    email,
    phone,
    password,
    user_type,
    confirmPassword,
    location
  );
  const renderFn = ({ success, msg }) => {
    res.send({
      success,
      msg,
    });
  };
  // validates important information
  const validateData = {
    first_name,
    last_name,
    email,
    phone,
    password,
  };
  const { error } = registerValidation(validateData);
  // checks if the validation return error
  if (error) return renderFn({ success: false, msg: error.message });

  // verifies password equality
  if (password != confirmPassword)
    return renderFn({
      success: false,
      msg: `Password for ${email} Does Not Match!`,
    });

  //  checks if email is already available in the system
  const getUserDetails = await UserModel.findOne({ email: email });
  if (getUserDetails)
    return renderFn({
      success: false,
      msg: ` ${getUserDetails.email} Already Exists!`,
    });

  // hashes user password before storing it

  const encryptedPassword = await hashedPassword(password);
  // converts user_type from strings to system numbers
  if (!encryptedPassword)
    return renderFn({ success: false, msg: 'Sorry,Something wen wrong' });
  const userRole = user_type === 'admin' ? 3 : user_type === 'agent' ? 1 : 0;
  // create new document
  console.log('-----select');
  console.log(userRole);
  const newUser = new UserModel({
    first_name,
    last_name,
    email,
    password: encryptedPassword,
    phone,
    location,
    user_type: userRole,
    gender,
  });

  // save user to database
  const savedUser = await newUser.save();
  console.log(savedUser);
  // sets message to connect flash
  if (!savedUser)
    return renderFn({
      success: false,
      msg: 'System is unable to create account ',
    });

  renderFn({
    success: true,
    msg: `Registration Successful, ${savedUser.first_name.toUpperCase()} ${savedUser.last_name.toUpperCase()} Can Now Login`,
  });
});

const filterUsers = asyncWrapper(async (req, res) => {
  const { selectedOption, inputValue } = req.body;

  const renderFn = async (_users, _error) => {
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
      } else if (element.active === false && element.user_type === 0) {
        addElements(deactivatedCustomers, element);
      }
    });

    const totalInactiveUsers =
      deactivatedAdmins.length +
      deactivatedAgents.length +
      deactivatedCustomers.length;

    res.render('Admin/adminGetUsers', {
      errors: _error ? _error : null,
      user: req.user[0],
      users: _users ? _users : allSystemUsers,
      hits: allSystemUsers.length,
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
  };
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  let errors = [];
  if (selectedOption.toLowerCase() === 'all' && !inputValue) {
    //
    const getAllUsers = await userModel.find({}, { password: 0 });
    return renderFn(getAllUsers, null);
  } else if (selectedOption.toLowerCase() === 'email') {
    const { error } = await validateEmail({ email: inputValue.trim() });

    if (error) {
      errors.push({ msg: error.message });
      return renderFn(null, errors);
    }

    // check if user is registered

    const getAllUsers = await userModel.find(
      { email: inputValue.trim() },
      { password: 0 }
    );

    console.log(getAllUsers);
    if (getAllUsers.length < 1) {
      errors.push({ msg: 'Email Is Not Registered!' });
      return renderFn(null, errors);
    }
    //no user found
    return renderFn(getAllUsers, null);
  } else if (selectedOption.toLowerCase() === 'role') {
    const convertedRole =
      inputValue.trim().toLowerCase() === 'admin'
        ? 3
        : inputValue.trim().toLowerCase() === 'customer'
        ? 0
        : inputValue.trim().toLowerCase() === 'agent'
        ? 1
        : undefined;
    const getAllUsers = await userModel.find(
      { user_type: convertedRole },
      { password: 0 }
    );

    if (convertedRole === undefined) {
      errors.push({
        msg: 'Invalid Role, Please Choose Either Admin,Agent Or Customer',
      });
      return renderFn(null, errors);
    }
    return renderFn(getAllUsers, null);
  } else if (selectedOption.toLowerCase() === 'location') {
    // capitalize the first letter
    const location = capitalizeFirstLetter(inputValue.trim());
    const getAllUsers = await userModel.find(
      { location: location },
      { password: 0 }
    );
    if (getAllUsers === undefined || getAllUsers.length == 0) {
      errors.push({ msg: 'Country Not Found, Please Try Another Name. ' });

      return renderFn(null, errors);
    }
    return renderFn(getAllUsers, null);
  } else if (selectedOption.toLowerCase() === 'status') {
    // check if input is active or inactive (else show error message please choose either of the two)
    const convertStatus =
      inputValue.trim().toLowerCase() === 'active'
        ? true
        : inputValue.trim().toLowerCase() === 'inactive'
        ? false
        : undefined;
    if (convertStatus === undefined) {
      errors.push({
        msg: 'Invalid String. Please Choose Either Active Or Inactive',
      });
      return renderFn(null, errors);
    }

    const getAllUsers = await userModel.find(
      { active: convertStatus },
      { password: 0 }
    );

    return renderFn(getAllUsers, null);
  } else {
    // TODO:add another if to check inappropriate combination
    const getAllUsers = await userModel.find({}, { password: 0 });
    errors.push({ msg: 'Invalid Combination!' });
    renderFn(getAllUsers, errors);
  }
  // Password123*
});

// get all user  : this  can only be done by the admin
const adminGetUser = asyncWrapper(async (req, res, next) => {
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
      } else if (element.active === false && element.user_type === 0) {
        addElements(deactivatedCustomers, element);
      }
    });

    const getUsers = await UserModel.find({}, { password: 0 });
    const totalInactiveUsers =
      deactivatedAdmins.length +
      deactivatedAgents.length +
      deactivatedCustomers.length;
    console.log('.......');
    console.log(req.user[0]);

    if (!getUsers) return next(createCustomError('no user found', 404));
    res.render('Admin/adminGetUsers', {
      errors: undefined,
      user: req.user[0],
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

  res.render('Admin/adminEditProfile', {
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

  const updateUserProfile = async (isMail,_email) => {

    const query =  {
      first_name: first_name,
      last_name: last_name,
      phone: phone,
      location,
    }


    const updatedUser = await userModel.findOneAndUpdate(
      { _id: req.user[0]._id },
    
      {
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        location,
        email: isMail ? _email : undefined
      }
  
      ,
      { new: true }
    );

    res.send({
      success: true,
      msg: 'Your Profile Has Been Updated, Please Refresh The Page To Reflect Changes',
    });
  };

  const userId = req.params.userId;
  if (!first_name || !last_name || !email || !phone || !location)
    return res.send({
      success: false,
      msg: 'Input field(s) must not be empty',
    });
  console.log('check email');
  console.log(checkEmail);
  if (checkEmail) {
    const { error } = await validateEmail({ email: email });
    if (error) return res.send({ success: false, msg: error.message });
    const findUser = await userModel.findOne({ email: email }, { password: 0 });

    if (email === req.user[0].email)
      return res.send({
        success: false,
        msg: 'This email is currently in use; if you would like to update it, please check the box and use a diffrent email.',
      });

    if (email !== req.user[0].email) {
      // checks if passed email equals retrieved user email
      console.log('....', findUser);
      if (findUser) {
        return res.send({
          success: false,
          msg: 'Sorry, you cannot use this email',
        });
      } else {
        updateUserProfile(true,email);
      }
    }
  } else {
    updateUserProfile(false);
  }
});

/**
 ** update user route
 *!: Strictly for admin
 */
const postAdminUpdateUser = asyncWrapper(async (req, res, next) => {
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
    last_name
  ) => {
    let getCustomer;
    if (userState === undefined) {
      getCustomer = await UserModel.findOne({ email: email }, { password: 0 });
    }
    const convertStateToBool =
      userState === 'activate'
        ? true
        : userState === 'deactivate'
        ? false
        : getCustomer.active;
    const convertRole = userRole === 'admin' ? 3 : userRole === 'agent' ? 1 : 0;
    console.log(convertStateToBool);
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

        return res.render('Admin/adminEditUser', {
          errors,
          userInfo: getUserData[0],
          id: req.params.userId,
          feedback: { success: false },
        });
      } else {
        return res.status(200).render('Admin/adminEditUser', {
          userInfo: req.user[0],
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
      // finds user with the provided email
      const findUser = await UserModel.findOne(
        { email: email },
        { password: 0 }
      );
      // check if email checkbox is selected

      if (selectEmail) {
        if (findUser) {
          errors.push({
            msg: 'You are already using this email; if you would like to update it, please check the box and choose a diffrent email.',
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

const adminDeactivateUser = asyncWrapper(async (req, res) => {
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
      res
        .status(200)
        .render(`Admin/adminViewUserProfile`, { userData: blockUser });
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

const adminReactivateUser = asyncWrapper(async (req, res) => {
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
        .render(`Admin/adminViewUserProfile`, { userData: activateUser });
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

const adminDeleteUser = asyncWrapper(async (req, res) => {
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

const adminViewUserProfile = asyncWrapper(async (req, res) => {
  const userData = await userModel.findOne(
    { email: req.params.email },
    { password: 0 }
  );
  console.log(userData);
  res.render('Admin/adminViewUserProfile', {
    user: req.user[0],
    userData: userData,
  });
});

const getAdminCreateUser = asyncWrapper((req, res) => {
  return res.render('Admin/adminCreateUser.ejs', {
    user: req.user[0],
    message: null,
    email: null,
  });
  // return
});
const getAdminUpdateUser = asyncWrapper(async (req, res) => {
  const user = await userModel.findOne(
    { _id: req.params.userId },
    { password: 0 }
  );
  console.log(req.user);
  res.render('Admin/adminEditUser', {
    loggedUser: req.user[0],
    user: user,
    userInfo: req.user[0],
    feedback: false,
  });
});
const getRegisterComponent = asyncWrapper((req, res) => {
  res.render('Admin/adminCreateUser');
});
module.exports = {
  userRegistration,
  adminGetUser,
  postAdminUpdateUser,
  viewUser,
  adminDeleteUser,
  adminDeactivateUser,
  adminReactivateUser,
  postAdminCreateUser,
  getAdminDashboard,
  filterUsers,
  adminUpdateProfile,
  updateProfile,

  adminViewUserProfile,
  getAdminCreateUser,
  getAdminUpdateUser,
  getRegisterComponent,
};
