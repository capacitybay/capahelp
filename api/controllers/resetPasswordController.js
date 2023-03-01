const UserModel = require('../../models/userModel');
require('../../utils/envSetup').config();
const asyncWrapper = require('../../middleware/controllerWrapper');
const { validatePassword } = require('../../validation/validation');
const { unHashPassword, hashedPassword } = require('../../auth/password');

// resets user password
const resetPassword = asyncWrapper(async (req, res, next) => {
  // get data from req body
  const { newPassword, confirmPassword } = req.body;
  const userId = req.params.userId;
  let errors = [];
  // check logged in user
  if (req.user[0]) {
    //  check for empty input
    if (!newPassword || !confirmPassword)
      return res.send({ error: true, msg: 'Input Cannot Be Empty' });
    // validate passwords

    const { error } = await validatePassword({ password: newPassword });

    if (error) return res.send({ error: true, msg: error.message });
    // get user with ID
    const user = await UserModel.find({ _id: req.user[0]._id });

    if (!user) return res.send({ error: true, msg: 'User Not Found' });

    // check equality
    if (newPassword !== confirmPassword)
      return res.send({ error: true, msg: "Password Doesn't Match" });
    // hash password
    const encryptedPassword = await hashedPassword(confirmPassword);
    // update password
    const updatePassword = await UserModel.updateOne(
      { _id: req.user[0]._id },
      { password: encryptedPassword },
      { new: true }
    );
    console.log(updatePassword);
    req.logout(function (error) {
      if (error) {
        req.next(error);
      }
      // TODO: flash message not implemented yet
      req.flash('success_msg', 'Please login with your new password');
      return res.redirect('/login');
    });
  }
});

module.exports = resetPassword;
