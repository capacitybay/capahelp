const UserModel = require("../../models/userModel");
const { hashedPassword } = require("../validation/password");
const { registerValidation } = require("../validation/validation");
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
  const validateData = { first_name, last_name, email, phone, password };
  const { error } = await registerValidation(validateData);
  if (error) {
    res.status(400).json(error.message);
  } else {
    try {
      const encryptedPassword = await hashedPassword(password);
      // create new document
      const newUser = new UserModel({
        first_name,
        last_name,
        email,
        password: encryptedPassword,
        phone,
        location,
        has_logged_in,
        user_type,

        active,
        last_logged_in,
      });
      // console.log(req.body);

      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
    } catch (err) {
      res.status(500).json(err.message);
    }
  }
  // console.log(CustomerModel);
};

// get all user controller

const getUser = (req, res) => {
  try {
    res.status(200).json("get customer route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
// get a user controller

const viewUser = (req, res) => {
  try {
    res.status(200).json("get one customer route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// update users

const updateUser = (req, res) => {
  try {
    res.status(200).json("update customer route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
// delete user

const deactivateUser = (req, res) => {
  try {
    res.status(200).json("deactivate user route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};
// delete user

const reactivateUser = (req, res) => {
  try {
    res.status(200).json("reactivate user route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// delete user

const deleteUser = (req, res) => {
  try {
    res.status(200).json("delete customer route");
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
