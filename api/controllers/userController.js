const UserModel = require('../../models/userModel');
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

  const validateData = { first_name, last_name, email, phone, password };
  const { error } = registerValidation(validateData);
  // checks if the validation return error
  if (error) return res.status(400).json(error.message);
  if (password != confirmPassword)
    return res
      .status(400)
      .json({ success: false, payload: 'password does not match' });
  if (!error) {
    const getUser = await UserModel.findOne({ email: email });
    if (getUser) return res.status(409).json('user already exists');

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
    res.status(200).json({
      success: true,
      result: savedUser,
    });
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
  const { error } = registerValidation(validateData);
  // checks if the validation return error
  if (error) return res.status(400).json(error.message);
  if (password != confirmPassword)
    return res
      .status(400)
      .json({ success: false, payload: 'password does not match' });
  if (!error) {
    const getUser = await UserModel.findOne({ email: email });
    if (getUser) return res.status(409).json('user already exists');

    // hashes user password before storing it

    const encryptedPassword = await hashedPassword(password);
    // create new document
    const userRole = user_type === 'admin' ? 3 : user_type === 'agent' ? 1 : 0;
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
    res.status(200).json({
      success: true,
      result: savedUser,
    });
  }

  // console.log(CustomerModel);
});

// get all user  : this  can only be done by the admin

const getUser = asyncWrapper(async (req, res, next) => {
  const loggedUser = req.user;
  console.log(loggedUser);
  if (!loggedUser)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated!' });
  if (loggedUser.user_type === 3) {
    const getUsers = await UserModel.find({}, { password: 0 });
    if (!getUsers) return next(createCustomError('no user found', 404));
    res
      .status(200)
      .json({ success: true, payload: getUsers, hits: getUsers.length });
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
  const { first_name, last_name, email, phone, location } = req.body;
  console.log('req.user');
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated' });
  const { id, user_type } = req.user;
  const userId = req.params.userId;
  if (userId === id || user_type === 3) {
    const validateData = { first_name, last_name, email, phone };
    console.log('validateData');
    const { error } = updateUserValidation(validateData);
    console.log('error');
    if (error)
      return res.status(400).json({ success: false, payload: error.message });

    const findUser = await UserModel.findOne({ email: email });
    console.log('findUser');
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
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated' });
  if (req.user.id && req.user.user_type === 3) {
    const blockUser = await UserModel.updateOne(
      { _id: req.params.userId },
      {
        active: false,
      }
    );

    if (blockUser.acknowledged) {
      res.status(200).json({
        success: true,
        payload: blockUser,
      });
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
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated' });
  if (req.user.id && req.user.user_type === 3) {
    const activateUser = await UserModel.updateOne(
      { _id: req.params.userId },
      {
        active: true,
      }
    );

    if (activateUser.acknowledged) {
      res.status(200).json({
        success: true,
        payload: activateUser,
      });
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
};
