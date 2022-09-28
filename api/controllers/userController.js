const UserModel = require("../../models/userModel");
const { hashedPassword } = require("../../auth/password");
const {
  registerValidation,
  updateUserValidation,
} = require("../../validation/validation");
//

const createUser = async (req, res) => {
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

  // validates the provided fields
  const validateData = { first_name, last_name, email, phone, password };
  const { error } = await registerValidation(validateData);

  // checks if the validation return error
  if (error) return res.status(400).json(error.message);
  if (!error) {
    try {
      const getUser = await UserModel.findOne({ email: email });
      if (getUser) return res.status(400).json("user already exists");

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
        user_type,
      });

      // save user to database
      const savedUser = await newUser.save();
      // sends response to the frontend
      res.status(200).json({
        success: true,
        savedUser,
      });
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
  // console.log(CustomerModel);
};

// get all user  : this  can only be done by the admin

const getUser = async (req, res) => {
  const loggedUser = req.user;

  try {
    if (loggedUser.role === 3) {
      const getUsers = await UserModel.find();
      res.status(200).json({ success: true, getUsers });
    } else {
      res.status(401).json({
        success: false,
        message: "You are not authorized to perform this operation",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};
// get a user controller

const viewUser = async (req, res) => {
  const loggedUser = req.user;

  try {
    if (loggedUser.id === req.params.userId || loggedUser.role === 3) {
      const userProfile = await UserModel.findOne({ _id: req.params.userId });
      res.status(200).json(userProfile);
    } else {
      res.status(200).json({
        success: false,
        message: "You're not  authorized to perform this operation",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// update users

const updateUser = async (req, res) => {
  // validates the provided fields
  const { first_name, last_name, email, phone, location } = req.body;
  console.log(first_name, last_name, email, phone, location);
  const { id, role } = req.user;
  const userId = req.params.userId;

  try {
    if (userId === id || role === 3) {
      const validateData = { first_name, last_name, email, phone };
      console.log(validateData);
      const { error } = updateUserValidation(validateData);
      console.log(error);
      if (error) return res.status(400).json(error.message);
      // checks if the email already exist

      const getUser = await UserModel.findOne({ email: email });
      if (getUser)
        return res
          .status(400)
          .json(`can't use ${email}, please use another email `);
      // updates the user
      if (!error) {
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
      }
    } else {
      res.status(400).json("you are not authorized to update this customer ");
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};
// delete user

const deactivateUser = async (req, res) => {
  try {
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
        message: "you are not authorized to deactivate a customer",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};
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
        message: "you are not authorized to activate a customer",
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
        message: "you are not authorized to delete a customer",
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
