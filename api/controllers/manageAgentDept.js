const DepartmentModel = require('../../models/departmentModel');

async function addAgent() {
  try {
    const updatedDept = await DepartmentModel.updateOne(
      {
        _id: deptId,
      },
      {
        $push: { members: userId },
      }
    );
  } catch (error) {
    res.status(500).json(error.message);
  }
  return updatedDept;
}
const addAgentToDept = async (req, res) => {
  try {
    const deptId = req.params.deptId;
    const userId = req.body.userId;

    const getDepartment = await DepartmentModel.findOne({ _id: deptId });
    // console.log(userId);
    // if (!getDepartment)
    //   return res
    //     .status(404)
    //     .json({ success: false, result: 'no department found' });

    // console.log(members[0]);
    // members.filter((item,index)=>userId===)
    if (getDepartment.members.length < 0) {
      const updatedDept = await DepartmentModel.updateOne(
        {
          _id: deptId,
        },
        {
          $push: { members: userId },
        }
      );
      res.status(200).json({
        success: true,
        result: updatedDept,
      });
    }

    for (let i = 0; i < getDepartment.members.length; i++) {
      if (getDepartment.members === userId) {
        return false;
        // res.status(400).json({
        //   success: false,
        //   result: 'User already belongs to this department',
        // });
      } else {
        return true;
        // const updatedDept = await DepartmentModel.updateOne(
        //   {
        //     _id: deptId,
        //   },
        //   {
        //     $push: { members: userId },
        //   }
        // );
        // res.status(200).json({
        //   success: true,
        //   result: updatedDept,
        // });
      }
    }
    // while (i < members.length) {
    //   if (members[i] != userId) {
    //     const updatedDept = await DepartmentModel.updateOne(
    //       {
    //         _id: deptId,
    //       },
    //       {
    //         $push: { members: userId },
    //       }
    //     );
    //     res.status(200).json({
    //       success: true,
    //       result: updatedDept,
    //     });
    //   } else {
    //     res.status(400).json({
    //       success: false,
    //       result: 'User already belongs to this department',
    //     });
    //     // console.log(members[i]);
    //   }
    //   i++;
    // }
    // res.status(200).json(getDepartment.members);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports = addAgentToDept;
// get dept
// check if user exist if yes throw err
// if not add a new user
// remove user from dept
