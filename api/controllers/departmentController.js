const DepartmentModel = require('../../models/departmentModel.js');
const {
  createDeptValidation,
  updateDeptValidation,
  validateEmail,
} = require('../../validation/validation');
const asyncWrapper = require('../../middleware/controllerWrapper');
const userModel = require('../../models/userModel.js');
// creates new department
const createDepartment = asyncWrapper(async (req, res) => {
  const { dept_name, head_agent, email, members } = req.body;
  // verify if user is authenticated
  console.log(dept_name, head_agent, email, members);
  const validateData = { dept_name, head_agent, email };
  const { error } = await createDeptValidation(validateData);

  // checks if error is returned from the validation
  if (error) return res.send({ success: false, msg: error.message });
  // executes if there was no error

  const getDept = await DepartmentModel.findOne({
    dept_name: req.body.dept_name,
  });

  if (getDept) {
    return res.send({
      success: false,
      msg: 'department already created',
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
    res.send({
      success: true,
      msg: savedDept,
    });
    // }
  }
});

// get all departments
const getDepartment = asyncWrapper(async (req, res) => {
  // verifies if the user is authenticated
  verifyUser(req, res);
  // if (req.user[0].user_type !== 3)
  //   return res.status(403).json({
  //     success: false,
  //     payload: 'you are not authorized to access this resource',
  //   });
  const getAllDept = await DepartmentModel.find();
  if (!getAllDept)
    return res
      .status(404)
      .json({ success: false, payload: 'No department found' });
  // sends response to frontend
  console.log(getAllDept);
  res.render('Admin/departments', {
    user: req.user[0],
    departments: getAllDept,
  });
  // .json({ success: true, payload: getAllDept, hits: getAllDept.length });
});

// get a  department with its id

const viewDepartment = asyncWrapper(async (req, res) => {
  const getDepartment = await DepartmentModel.find({ _id: req.params.deptId });

  console.log(getDepartment);

  res.render('Admin/viewDepartment', {
    user: req.user[0],
    departmentInfo: getDepartment[0],
  });
  // verifyUser(req, res);
  // if (req.user.user_type !== 3)
  //   return res.status(403).json({
  //     success: false,
  //     payload: 'You are not authorized to perform this operation',
  //   });
  // // checks if department id is provided{not functional yet}
  // if (!req.params)
  //   return res
  //     .status(400)
  //     .json({ success: false, payload: 'Select a valid  department' });
  // const getDept = await DepartmentModel.findOne({ _id: req.params.deptId });
  // // cj
  // if (!getDept)
  //   return res
  //     .status(404)
  //     .json({ success: false, payload: 'department not found' });
  // res.status(200).json({
  //   success: true,
  //   payload: getDept,
  // });
});

const deactivateDepartment = asyncWrapper(async (req, res) => {
  const deactivateDept = await DepartmentModel.findOneAndUpdate(
    { _id: req.params.deptId },
    { active: false },
    { new: true }
  );
  if (deactivateDept) {
    req.flash(
      'success_msg',
      ` ${deactivateDept.dept_name.toUpperCase()} Department  Deactivated!`
    );
    // renders message to frontend
    res
      .status(200)
      .render(`Admin/viewDepartment`, { departmentInfo: deactivateDept });
  } else {
    // TODO:this will return an error dialog
  }
});
const reactivateDepartment = asyncWrapper(async (req, res) => {
  const reactivateDept = await DepartmentModel.findOneAndUpdate(
    { _id: req.params.deptId },
    { active: true },
    { new: true }
  );
  if (reactivateDept) {
    req.flash(
      'success_msg',
      ` ${reactivateDept.dept_name.toUpperCase()} Department  Activated!`
    );
    // renders message to frontend
    res
      .status(200)
      .render(`Admin/viewDepartment`, { departmentInfo: reactivateDept });
  } else {
    // TODO:this will return an error dialog
  }
});

const filterDepartments = asyncWrapper(async (req, res) => {
  const { selectedValue, inputValue } = req.body;
  const getAllDept = await DepartmentModel.find({});
  console.log(selectedValue, inputValue);
  const renderFn = (_result, _errors) => {
    // TODO: crete an array that will push error obj

    return res.render('Admin/departments', {
      errors: _errors ? error : null,
      user: req.user[0],
      departments: _result ? _result : getAllDept,
    });
  };
  // let filteredDepartments = [];
  const filteredDepartments = (_selectedValue, _inputValue, _errors) => {
    console.log(_selectedValue, _inputValue);
    const result = [];
    let error = [];
    if (_errors) {
      error.push(_errors);
    }
    getAllDept.forEach((element) => {
      if (element._selectedValue === _inputValue) {
        result.push(element);
      }
      console.log('------------');
      console.log(result);

      if (result <= 0) {
        return renderFn(null, {
          msg: 'Resource cannot be found!, Please try another search term.',
        });
      } else {
        return renderFn(result, null);
      }
    });
  };

  if (selectedValue.toLowerCase() === 'email') {
    const { error } = await validateEmail({ email: inputValue.trim() });
    if (error) return renderFn(null, { msg: error.message });
    if (!inputValue)
      return renderFn(null, { msg: "Please Enter Department's Email" });
    return filteredDepartments('email', inputValue);
  } else if (selectedValue.toLowerCase() === 'agent') {
    if (!inputValue)
      return renderFn(null, { msg: "Please Enter Agent's Name" });

    return filteredDepartments('head_agent', inputValue);
  } else if (selectedValue.toLowerCase() === 'name') {
    if (!inputValue)
      return renderFn(null, { msg: "Please Enter Departments's Name" });
    return filteredDepartments('dept_name', inputValue);
  } else if (selectedValue.toLowerCase() === 'status') {
    if (!inputValue)
      return renderFn(null, {
        msg: "Please Enter Departments's Status (active or inactive)",
      });
    // function convertStatus (_status){
    //   return _status !== "active" ? false : true
    // }

    if (inputValue.toLowerCase() === 'active') {
      return filteredDepartments('active', true);
    } else if (inputValue.toLowerCase() === 'inactive') {
      return filteredDepartments('inactive', false);
    }
  }
});

const getCreateDepartment = asyncWrapper(async (req, res) => {
  const getAgents = await userModel.find({ user_type: 1 }, { password: 0 });
  return res.render('Admin/adminCreateDepartment', {
    user: req.user[0],
    agents: getAgents,
  });
});

// updates a specified  department

// validate if no was returned
// create functionality for removing agents from department

const getUpdateDepartment = asyncWrapper(async (req, res) => {
  const getDepartments = await DepartmentModel.findOne({
    _id: req.params.deptId,
  });
  const getAgents = await userModel.find(
    {
      $and: [{ user_type: 1 }, { active: true }],
    },
    { password: 0 }
  );

  return res.render('Admin/updateDepartment', {
    user: req.user[0],
    departmentInfo: getDepartments,
    agents: getAgents,
  });
});
// const deleteDepartment = asyncWrapper(async (req, res) => {});
const updateDepartment = asyncWrapper(async (req, res) => {
  const { dept_name, head_agent, email, members, status } = req.body;
  console.log(dept_name, head_agent, email, members, req.params.deptId, status);
  const getDepartments = await DepartmentModel.findOne({
    _id: req.params.deptId,
  });

  const getAgents = await userModel.find(
    {
      $and: [{ user_type: 1 }, { active: true }],
    },
    { password: 0 }
  );

  let errors = [];
  if (!req.params.deptId) {
    errors.push({ msg: 'Please select a department' });
  }
  //still working on this
  const validateData = { dept_name, head_agent, email };

  const { error } = await updateDeptValidation(validateData);

  if (error) {
    errors.push({ msg: error.message });
  }
  if (errors.length > 0) {
    return res.render('Admin/updateDepartment', {
      errors: errors,
      user: req.user[0],
      departmentInfo: getDepartments,
      agents: getAgents,
    });
  } else {
    // checks if user is already in the department

    const getDept = await DepartmentModel.findOne({
      $and: [{ members: { $in: [members] } }, { _id: req.params.deptId }],
    });

    // checks if already exists in a department
    if (getDept) {
      errors.push({ msg: 'user already exist in department' });
      return res.render('Admin/updateDepartment', {
        errors: errors,
        user: req.user[0],
        departmentInfo: getDepartments,
        agents: getAgents,
      });
    }
    // executes if no result was returned from the first search
    console.log('updateDepartment');
    const convertStatus =
      status === 'activate'
        ? true
        : status === 'deactivate'
        ? false
        : undefined;
    const updatedDept = await DepartmentModel.findOneAndUpdate(
      { _id: req.params.deptId },
      {
        dept_name,
        head_agent,
        email,
        active: convertStatus,
        $push: { members: members },
      },
      { runValidators: true, context: 'query' }
    );

    if (!updatedDept) {
      errors.push({ msg: 'Department not updated' });
      return res.render('Admin/updateDepartment', {
        errors: errors,
        user: req.user[0],
        departmentInfo: getDepartments,
        agents: getAgents,
      });
    }

    return res.render('Admin/updateDepartment', {
      errors: null,
      success_msg:
        ' Department is Updated, Please refresh Your browser To Reflect Change',
      user: req.user[0],
      departmentInfo: getDepartments,
      agents: getAgents,
    });
  }
});

const removeAgentFromDepartment = asyncWrapper(async (req, res) => {
  const { dept_name, head_agent, email, userId } = req.body;
  // console.log(userId);
  verifyUser(req, res);

  if (req.user.user_type !== 3)
    return res.status(401).json({
      success: false,
      payload: 'You are not authorized to access this resource',
    });

  if (!req.params.deptId)
    return res
      .status(400)
      .json({ success: false, payload: 'Please select a department' });
  const validateData = { dept_name, head_agent, email };
  const { error } = await updateDeptValidation(validateData);
  if (error) return res.status(400).json(error.message);

  if (!error) {
    // checks if user is already in the department
    const getDept = await DepartmentModel.findOne({
      $and: [{ _id: req.params.deptId }, { members: userId }],
    });

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
        payload: deleteAgent,
      });
    }
    // return res.status(409).json('user already exist in department');
  }
});

// delete departments
const deleteDepartment = asyncWrapper(async (req, res) => {
  const deletedDept = await DepartmentModel.findOneAndDelete(
    {
      _id: req.params.deptId,
    },
    { new: true }
  );

  if (!deletedDept)
    return res.send({
      success: false,
      msg: `Sorry!, Something Went Wrong!`,
    });
  // checks if the query returns true

  return res.send({
    success: true,
    msg: `You Have Successfully Deleted ${deletedDept._id}`,
  });
});

module.exports = {
  createDepartment,
  getDepartment,
  deleteDepartment,
  updateDepartment,
  viewDepartment,
  removeAgentFromDepartment,
  deactivateDepartment,
  reactivateDepartment,
  getUpdateDepartment,
  getCreateDepartment,
  filterDepartments,
};

const verifyUser = (req, res) => {
  if (!req.user)
    return res
      .status(401)
      .json({ success: false, payload: 'You are not authenticated' });
};

// const updateDepartment = asyncWrapper(async (req, res) => {
//   const { dept_name, head_agent, email, members } = req.body;

//   if (!req.params.deptId)
//     return res.send({ success: false, msg: 'Please select a department' });
//   //still working on this
//   const validateData = { dept_name, head_agent, email };
//   const { error } = await updateDeptValidation(validateData);
//   if (error) return res.send({ success: false, msg: error.message });
//   if (!error) {
//     // checks if user is already in the department
//     const getDept = await DepartmentModel.findOne({ members: members });
//     // checks if already exists in a department
//     if (getDept)
//       return res.send({
//         success: false,
//         msg: 'user already exist in department',
//       });
//     // executes if no result was returned from the first search

//     const updatedDept = await DepartmentModel.updateOne(
//       {
//         _id: req.params.deptId,
//       },
//       {
//         dept_name,
//         head_agent,
//         email,
//         $push: { members: members },
//       },

//       { runValidators: true, context: 'query' }
//     );
//     if (!updatedDept.modifiedCount)
//       return res.status(204).send({
//         success: false,
//         msg: 'Department not updated',
//       });
//     res.status(200).send({
//       success: true,
//       payload: updatedDept,
//     });
//   }
// });
