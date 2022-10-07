const DepartmentModel = require('../../models/departmentModel.js');
const {
  createDeptValidation,
  updateDeptValidation,
} = require('../../validation/validation');
const asyncWrapper = require('../../middleware/controllerWrapper');
const createDepartment = asyncWrapper(async (req, res) => {
  const { dept_name, head_agent, email, members } = req.body;
  if (req.user.id && req.user.role === 3) {
    const validateData = { dept_name, head_agent, email };
    const { error } = await createDeptValidation(validateData);
    // checks if error is returned from the validation
    if (error) return res.status(400).json(error.message);
    // executes if there was no error
    if (!error) {
      const getDept = await DepartmentModel.findOne({
        dept_name: req.body.dept_name,
      });
      if (getDept) {
        res.status(409).json({
          success: false,
          message: 'department already created',
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
          message: 'department created',
          obj: savedDept,
        });
        // }
      }
    }
  } else {
    res.status(401).json({
      success: false,
      message: 'you are not authorized to perform this operation',
    });
  }
});

// get all departments
const getDepartment = asyncWrapper(async (req, res) => {
  // verifies if the user is authenticated
  if (req.user.id && req.user.role === 3) {
    const getAllDept = await DepartmentModel.find();

    if (!getAllDept)
      return res
        .status(404)
        .json({ success: false, result: 'No department found' });
    // sends response to frontend
    res.status(200).json({ success: true, result: getAllDept });
  } else {
    res.status(403).json({
      success: false,
      result: 'you are not authorized to access this resource',
    });
  }
});

// get a  department with its id

const viewDepartment = asyncWrapper(async (req, res) => {
  // verifies if the user is authenticated
  if (!req.user.id && !req.user.role === 3)
    return res
      .status(401)
      .json({ success: false, result: 'You are not authenticated' });
  // checks if department id is provided{not functional yet}
  if (!req.params)
    return res
      .status(400)
      .json({ success: false, result: 'Select a valid  department' });

  const getDept = await DepartmentModel.findOne({ _id: req.params.deptId });
  // cj
  if (!getDept)
    return res
      .status(404)
      .json({ success: false, result: 'department not found' });
  res.status(200).json({
    success: true,
    result: getDept,
  });
});

// updates a specified  department

// validate if no was returned
// create functionality for removing agents from department

const updateDepartment = asyncWrapper(async (req, res) => {
  const { dept_name, head_agent, email, members } = req.body;

  if (!req.user.id && !req.user.role === 3)
    return res.status(401).json({
      success: false,
      result: 'You are not authorized to access this resource',
    });

  if (!req.params.deptId)
    return res
      .status(400)
      .json({ success: false, result: 'Please select a department' });
  //still working on this
  const validateData = { dept_name, head_agent, email };
  const { error } = await updateDeptValidation(validateData);
  if (error) return res.status(400).json(error.message);
  if (!error) {
    // checks if user is already in the department
    const getDept = await DepartmentModel.findOne({ members: members });
    // checks if already exists in a department
    if (getDept)
      return res.status(409).json('user already exist in department');
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
});

const removeAgentFromDepartment = asyncWrapper(async (req, res) => {
  const { dept_name, head_agent, email, userId } = req.body;
  console.log(userId);

  if (!req.user)
    return res.status(401).json({
      success: false,
      result: 'You are not authenticated',
    });
  if (!req.user.id && !req.user.role === 3)
    return res.status(401).json({
      success: false,
      result: 'You are not authorized to access this resource',
    });

  if (!req.params.deptId)
    return res
      .status(400)
      .json({ success: false, result: 'Please select a department' });
  const validateData = { dept_name, head_agent, email };
  const { error } = await updateDeptValidation(validateData);
  if (error) return res.status(400).json(error.message);

  if (!error) {
    // checks if user is already in the department
    const getDept = await DepartmentModel.findOne({
      $and: [{ _id: req.params.deptId }, { members: userId }],
    });
    console.log(getDept);
    if (getDept) {
      const deleteAgent = await DepartmentModel.updateOne(
        {
          _id: req.params.deptId,
        },
        {
          $pull: { members: userId },
        }
      );
      res.status(200).json({
        success: true,
        result: deleteAgent,
      });
    }
    // return res.status(409).json('user already exist in department');
  }
});

// delete departments
const deleteDepartment = asyncWrapper(async (req, res) => {
  if (req.user.id && req.user.role === 3 && req.params.deptId) {
    const deletedDept = await DepartmentModel.deleteOne({
      _id: req.params.deptId,
    });
    if (deletedDept.acknowledged)
      return res.status(200).json({ success: true, result: deletedDept });
    // checks if the query returns true
    if (!deletedDept.acknowledged)
      return res.status(400).json({ success: false, result: deletedDept });
  } else {
    res.status(400).json({
      success: false,
      message: 'You are not authorized to perform this operation',
    });
  }
  // res.status(200).json("delete department route");
});

module.exports = {
  createDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
  removeAgentFromDepartment,
};
