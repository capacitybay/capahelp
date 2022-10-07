const UserModel = require('../../models/userModel');
const { hashedPassword } = require('../../auth/password');
const {
  registerValidation,
  updateUserValidation,
} = require('../../validation/validation');
//
const controllerWrapper = require('../../middleware/controllerWrapper');
const { createCustomError } = require('../../middleware/customError');

const createUser = controllerWrapper(async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    phone,
    password,
    has_logged_in,
    user_type,
    location,
    active,
    last_logged_in,
  } = req.body;
  // checks if payload was sent or checks if th user is logged in

  const validateData = { first_name, last_name, email, phone, password };
  const { error } = registerValidation(validateData);
  // checks if the validation return error
  if (error) return res.status(400).json(error.message);

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

// get all user  : this  can only be done by the admin

const getUser = controllerWrapper(async (req, res, next) => {
  const loggedUser = req.user;
  if (!loggedUser)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated!' });
  if (loggedUser.role === 3) {
    const getUsers = await UserModel.find();
    if (!getUsers) return next(createCustomError('no user found', 404));
    res.status(200).json({ success: true, getUsers });
  } else {
    res.status(401).json({
      success: false,
      message: 'You are not authorized to perform this operation',
    });
  }
});
// get a user controller

const viewUser = controllerWrapper(async (req, res, next) => {
  const loggedUser = req.user;
  if (!loggedUser)
    return res
      .status(401)
      .json({ success: false, result: 'you are not authenticated!' });

  if (loggedUser.id === req.params.userId || loggedUser.role === 3) {
    const userProfile = await UserModel.findOne({ _id: req.params.userId });
    if (!userProfile) return next(createCustomError('user not found', 404));
    // res
    //   .status(404)
    //   .json({ success: false, payload: 'user not found' });
    res.status(200).json({ success: true, result: userProfile });
  } else {
    res.status(401).json({
      success: false,
      payload: "You're not  authorized to perform this operation",
    });
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

const updateUser = controllerWrapper(async (req, res, next) => {
  // validates the provided fields
  const { first_name, last_name, email, phone, location } = req.body;
  console.log('req.user');
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated' });
  const { id, role } = req.user;
  const userId = req.params.userId;
  if (userId === id || role === 3) {
    const validateData = { first_name, last_name, email, phone };
    console.log('validateData');
    const { error } = updateUserValidation(validateData);
    console.log('error');
    if (error) return res.status(400).json(error.message);

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
        msg: updatedUser,
      });
    }
  } else {
    res.status(400).json('you are not authorized to update this customer ');
  }
});
// deactivate user

const deactivateUser = controllerWrapper(async (req, res) => {
  if (req.user.id && req.user.role === 3) {
    const blockUser = await UserModel.updateOne(
      { _id: req.params.userId },
      {
        active: false,
      }
    );

    if (blockUser.acknowledged) {
      res.status(200).json({
        success: true,
        message: blockUser,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: 'you are not authorized to deactivate a customer',
    });
  }
});
// delete user

const reactivateUser = async (req, res) => {
  try {
    if (req.user.id && req.user.role === 3) {
      const activateUser = await UserModel.updateOne(
        { _id: req.params.userId },
        {
          active: true,
        }
      );

      if (activateUser.acknowledged) {
        res.status(200).json({
          success: true,
          message: activateUser,
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'you are not authorized to activate a customer',
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// delete user

const deleteUser = async (req, res) => {
  try {
    if (
      req.user.id === req.params.userId ||
      (req.user.id && req.user.role === 3)
    ) {
      const deletedUser = await UserModel.deleteOne({ _id: req.params.userId });
      if (deletedUser.acknowledged) {
        res.status(200).json({ success: true, message: deletedUser });
      }
    } else {
      res.status(400).json({
        success: false,
        message: 'you are not authorized to delete a customer',
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  viewUser,
  deleteUser,
  deactivateUser,
  reactivateUser,
};
