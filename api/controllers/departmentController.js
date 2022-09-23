const DepartmentModel = require("../../models/departmentModel.js");

const createDepartment = async (req, res) => {
  const { dept_name, head_agent, email, members } = req.body;
  const newDepartment = new DepartmentModel({
    dept_name,
    head_agent,
    email,
    members,
  });
  try {
    const savedDept = await newDepartment.save();
    res.status(200).json(savedDept);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// get departments
const getDepartment = async (req, res) => {
  try {
    res.status(200).json("get department route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// get department
const viewDepartment = async (req, res) => {
  try {
    res.status(200).json("view department route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// get departments
const updateDepartment = async (req, res) => {
  try {
    res.status(200).json("update department route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// delete departments
const deleteDepartment = async (req, res) => {
  try {
    res.status(200).json("delete department route");
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = {
  createDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
};
