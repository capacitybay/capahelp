const DepartmentModel = require('../../models/departmentModel.js');
const {
  createDeptValidation,
  updateDeptValidation,
  validateEmail,
} = require('../../validation/validation');
const asyncWrapper = require('../../middleware/controllerWrapper');
const userModel = require('../../models/userModel.js');

const populateCard = (getAllDept) => {
  let emptyDept = getAllDept.filter((element) => element.members.length === 0);
  let activeDept = getAllDept.filter((element) => element.active === true);
  let inactiveDept = getAllDept.filter((element) => element.active === false);
  let totalDept = getAllDept.length;
  return [emptyDept, activeDept, inactiveDept, totalDept];
};

// creates new department
const createDepartment = asyncWrapper(async (req, res) => {
  const { dept_name, head_agent, email, members } = req.body;
  console.log(dept_name, head_agent, email, members);

  // verify if user is authenticated
  const validateData = { dept_name, head_agent, email };
  const { error } = await createDeptValidation(validateData);
  // checks if error is returned from the validation
  const renderFn = (status, message) => {
    res.send({
      success: status,
      msg: message,
    });
  };
  if (error) return renderFn(false, error.message);
  // executes if there was no error

  const getDept = await DepartmentModel.findOne({
    dept_name: req.body.dept_name,
  });

  const getDeptEmail = await DepartmentModel.findOne({ email: email });

  if (getDeptEmail)
    return renderFn(
      false,
      `Department Email "${getDeptEmail.email}" already exists, please choose another email`
    );

  if (getDept) {
    // Logs error if department is found in DB
    return renderFn(false, 'Department Already Created');
  } else {
    const newDepartment = new DepartmentModel({
      dept_name,
      head_agent,
      email,
      members: [...members],
    });
    console.log('success');
    const savedDept = await newDepartment.save();

    if (savedDept) {
      // Logs success msg if update returns true
      return renderFn(true, `Department "${savedDept.dept_name}",  Created !`);
    } else {
      return renderFn(false, `OOps!, Something Went Wrong, Please try Again`);
    }
  }
});

// get all departments in the system
const getDepartment = asyncWrapper(async (req, res) => {
  const getAllDept = await DepartmentModel.find({});
  const [emptyDept, activeDept, inactiveDept, totalDept] =
    populateCard(getAllDept);
  if (!getAllDept)
    return render('Admin/manage/adminGetDepartments', {
      totalDept: totalDept ? totalDept.length : 0,
      totalActiveDept: activeDept ? activeDept.length : 0,
      totalInactiveDept: inactiveDept ? inactiveDept.length : 0,
      totalEmptyDept: emptyDept ? emptyDept.length : 0,
      success: false,
      errors: [{ msg: 'No Department found' }],
    });
  // sends response to frontend
  res.render('Admin/adminGetDepartments', {
    totalDept: getAllDept ? getAllDept.length : 0,
    totalActiveDept: activeDept ? activeDept.length : 0,
    totalInactiveDept: inactiveDept ? inactiveDept.length : 0,
    totalEmptyDept: emptyDept ? emptyDept.length : 0,
    user: req.user[0],
    departments: getAllDept,
  });
});
//* ----------------------------------------------------------------------------------
// get a  department with its id
const adminViewDepartment = asyncWrapper(async (req, res) => {
  const getDepartment = await DepartmentModel.find({ _id: req.params.deptId });
  res.render('Admin/adminViewDepartment', {
    user: req.user[0],
    departmentInfo: getDepartment[0],
  });
});

//* ----------------------------------------------------------------------------------
// ** deactivates  department
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
    res.render(`Admin/adminViewDepartment`, { departmentInfo: deactivateDept });
  } else {
    req.flash('error_msg', `Sorry!, Something Went Wrong`);
    res.render(`Admin/adminViewDepartment`, { user: req.user[0] });
  }
});
//* ----------------------------------------------------------------------------------
// ** reactivates  department
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
      .render(`Admin/adminViewDepartment`, { departmentInfo: reactivateDept });
  } else {
    req.flash('error_msg', `Sorry!, Something Went Wrong`);

    res.render(`Admin/adminViewDepartment`, { user: req.user[0] });
  }
});

//* ----------------------------------------------------------------------------------
// ** filterOut   department

const getFilterDepartments = asyncWrapper(async (req, res) => {
  const getAllDept = await DepartmentModel.find({});
  const [emptyDept, activeDept, inactiveDept, totalDept] =
    populateCard(getAllDept);
  return res.render('Admin/adminGetDepartments', {
    totalDept,
    totalActiveDept: activeDept ? activeDept.length : 0,
    totalInactiveDept: inactiveDept ? inactiveDept.length : 0,
    totalEmptyDept: emptyDept ? emptyDept.length : 0,
    user: req.user[0],
    departments: getAllDept,
  });
});

//* ----------------------------------------------------------------------------------
// ** filterOut   department
const filterDepartments = asyncWrapper(async (req, res) => {
  const { selectedValue, inputValue } = req.body;
  const getAllDept = await DepartmentModel.find({});
  const [emptyDept, activeDept, inactiveDept, totalDept] =
    populateCard(getAllDept);

  /**
   *
   * @param {string input from select element} _selectedValue
   * @param {search term*} _inputValue
   * @param {error object} _errors
   * @returns render method(this displays the layout)
   */
  const renderFn = (_selectedValue, _inputValue, _errors) => {
    let result = [];
    let error = [];

    if (_errors) {
      error.push(_errors);
      return res.render('Admin/adminGetDepartments', {
        errors: _errors ? error : null,
        user: req.user[0],
        departments: getAllDept,
        totalActiveDept: activeDept ? activeDept.length : 0,
        totalInactiveDept: inactiveDept ? inactiveDept.length : 0,
        totalEmptyDept: emptyDept ? emptyDept.length : 0,
        totalDept,
      });
    } else {
      if (_selectedValue.toLowerCase() === 'head_agent') {
        const getRegex = new RegExp(_inputValue.trim(), 'i');
        getAllDept.forEach((element) => {
          if (getRegex.exec(element.head_agent)) {
            result.push(element);
          }
        });
      } else if (_selectedValue.toLowerCase() === 'dept_name') {
        const getRegex = new RegExp(_inputValue.trim(), 'i');
        getAllDept.forEach((element) => {
          if (getRegex.exec(element.dept_name)) {
            result.push(element);
          }
        });
      } else {
        getAllDept.forEach((element) => {
          if (element[_selectedValue] === _inputValue) {
            result.push(element);
          }
        });
      }
      // sends search error to FE if match was not found
      if (result.length === 0) {
        error.push({
          msg: 'Resource Cannot Be Found!, Please Try Another Search Term.',
        });
        return res.render('Admin/adminGetDepartments', {
          totalActiveDept: activeDept ? activeDept.length : 0,
          totalInactiveDept: inactiveDept ? inactiveDept.length : 0,
          totalEmptyDept: emptyDept ? emptyDept.length : 0,
          totalDept,
          errors: error,
          user: req.user[0],
          departments: getAllDept,
        });
      } else {
        return res.render('Admin/adminGetDepartments', {
          errors: null,
          user: req.user[0],
          totalDept,
          departments: result,
          totalActiveDept: activeDept ? activeDept.length : 0,
          totalInactiveDept: inactiveDept ? inactiveDept.length : 0,
          totalEmptyDept: emptyDept ? emptyDept.length : 0,
        });
      }
    }
  };
  // search conditions
  if (!selectedValue && !inputValue) {
    return renderFn(selectedValue, inputValue, {
      msg: 'Please Select The Right Search Combination',
    });
  }
  if (!selectedValue && inputValue) {
    return renderFn(selectedValue, inputValue, {
      msg: 'Please Select The Right Search Combination',
    });
  }
  if (selectedValue.toLowerCase() === 'email') {
    const { error } = await validateEmail({ email: inputValue.trim() });
    if (error)
      return renderFn(selectedValue, inputValue, { msg: error.message });

    return renderFn(selectedValue, inputValue, null);
  }

  if (selectedValue.toLowerCase() === 'head_agent') {
    if (!inputValue)
      return renderFn(selectedValue, inputValue, {
        msg: "Please Enter Agent's Name",
      });

    return renderFn(selectedValue, inputValue, null);
  }

  if (selectedValue.toLowerCase() === 'dept_name') {
    if (!inputValue)
      return renderFn(selectedValue, inputValue, {
        msg: "Please Enter Departments's Name",
      });
    return renderFn(selectedValue, inputValue, null);
  }

  if (selectedValue.toLowerCase() === 'status') {
    if (!inputValue)
      return renderFn(selectedValue, inputValue.toLowerCase().trim(), {
        msg: "Please Enter Departments's Status (active or inactive)",
      });

    if (inputValue.toLowerCase() === 'active') {
      return renderFn('active', true, null);
    } else if (inputValue.toLowerCase() === 'inactive') {
      return renderFn('active', false, null);
    } else {
      return renderFn('active', undefined, {
        msg: "Can't Find resource With The Input Provided!",
      });
    }
  }
});

//* ----------------------------------------------------------------------------------
// ** gets create  department form

const getCreateDepartment = asyncWrapper(async (req, res) => {
  const getAgents = await userModel.find({ user_type: 1 }, { password: 0 });
  return res.render('Admin/adminCreateDepartment', {
    user: req.user[0],
    agents: getAgents,
  });
});

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

  let deptMembers = [];
  getAgents.forEach((element) => {
    // console.log(getDepartments?.members);
    if (getDepartments?.members.includes(element._id)) {
      deptMembers.push(element);
    }
  });
  console.log(deptMembers);

  return res.render('Admin/adminUpdateDepartment', {
    user: req.user[0],
    departmentInfo: getDepartments,
    agents: getAgents,
    deptMembers: deptMembers,
  });
});
//* ----------------------------------------------------------------------------------
// ** Update  department
const adminUpdateDepartment = asyncWrapper(async (req, res) => {
  const { dept_name, head_agent, email, members, status } = req.body;
  const renderFn = ({ status, message, agents, departmentInfo, members }) => {
    res.send({
      success: status,
      msg: message,
      agents,
      departmentInfo,
      members,
    });
  };
  console.log(dept_name, head_agent, email, members, status);

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
  const validateData = { dept_name, head_agent, email };
  //input validation
  const { error } = await updateDeptValidation(validateData);

  if (error)
    return renderFn({
      status: false,
      message: error.message,
      agents: getAgents,
      departmentInfo: getDepartments,
    });

  // checks if user is already in the department
  const getMembers = await DepartmentModel.find({ _id: req.params.deptId });
  if (!getMembers)
    return renderFn({
      status: false,
      message: 'No Department Found!',
      agents: getAgents,
      departmentInfo: getDepartments,
    });

  const checkMember = getMembers.find((item) => members.includes(item));
  if (checkMember)
    return renderFn({
      status: false,
      message: 'Agent aLready Exists In Department!',
      agents: getAgents,
      departmentInfo: getDepartments,
    });
  // executes if no result was returned from the first search
  const convertStatus =
    status === 'activate' ? true : status === 'deactivate' ? false : undefined;

  const updatedDept = await DepartmentModel.findOneAndUpdate(
    { _id: req.params.deptId },
    {
      dept_name,
      head_agent,
      email,
      active: convertStatus,
      $push: { members: { $each: [...members] } },
    },
    { runValidators: true, context: 'query' }
  );

  if (!updatedDept)
    return renderFn({
      status: false,
      message: 'Department not updatedt!',
      agents: getAgents,
      departmentInfo: getDepartments,
    });

  return renderFn({
    status: true,
    message:
      'Department is Updated, Please refresh Your browser To Reflect Change',
    agents: getAgents,
    departmentInfo: getDepartments,
  });

  // const getDept = await DepartmentModel.findOne({
  //   $and: [{ members: { $in: [members] } }, { _id: req.params.deptId }],
  // });
});

const removeAgentFromDepartment = asyncWrapper(async (req, res) => {
  const { dept_name, head_agent, email, userId } = req.body;

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
  adminUpdateDepartment,
  adminViewDepartment,
  removeAgentFromDepartment,
  deactivateDepartment,
  reactivateDepartment,
  getUpdateDepartment,
  getCreateDepartment,
  filterDepartments,
  getFilterDepartments,
};
