const DepartmentModel = require("../../models/departmentModel.js");
const { createDeptValidation } = require("../../validation/validation");
const createDepartment = async (req, res) => {
  const { dept_name, head_agent, email, members } = req.body;
  if (req.user.id && req.user.role === 3) {
    const validateData = { dept_name, head_agent, email };
    const { error } = await createDeptValidation(validateData);
    // checks if error is returned from the validation
    if (error) return res.status(400).json(error.message);
    try {
      // executes if there was no error
      if (!error) {
        const getDept = await DepartmentModel.findOne({
          dept_name: req.body.dept_name,
        });
        if (getDept) {
          res.status(409).json({
            success: false,
            message: "department already created",
          });
        } else {
          const newDepartment = new DepartmentModel({
            dept_name,
            head_agent,
            email,
            members,
          });
          const savedDept = await newDepartment.save();
          // if (savedDept.acknowledged) {
          res.status(200).json({
            success: true,
            message: "department created",
            obj: savedDept,
          });
          // }
        }
      }
    } catch (error) {
      res.status(500).json(error.message);
    }
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
//find all depts
// get params
// find de

// get departments
const updateDepartment = async (req, res) => {
  const { dept_name, head_agent, email, members } = req.body;

  try {
    if (req.user.id && req.user.role === 3 && req.params.deptId) {
      //still working on this
      const validateData = { dept_name, head_agent, email };
      const { error } = await createDeptValidation(validateData);
      if (error) return res.status(400).json(error.message);
      if (!error) {
        // checks if user is already in the department
        const getDept = await DepartmentModel.findOne({ members: members });
        if (getDept)
          return res.status(409).json("user already exist in department");
        // executes if no result was returned from the first search
        const updatedDept = await DepartmentModel.updateOne(
          {
            _id: req.params.deptId,
          },
          {
            dept_name,
            head_agent,
            email,
            $push: { members: members },
          }
        );

        res.status(200).json({
          success: true,
          result: updatedDept,
        });
      }
    }
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
