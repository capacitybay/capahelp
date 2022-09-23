const UserModel = require("../../models/userModel");

const createUser = async (req, res) => {
  // console.log(CustomerModel);
  const {
    first_name,
    last_name,
    email,
    phone,
    has_logged_in,
    active,
    last_logged_in,
  } = req.body;
  const newUser = new UserModel({
    first_name,
    last_name,
    email,
    phone,
    has_logged_in,
    active,
    last_logged_in,
  });
  console.log(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
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
