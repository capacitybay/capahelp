const UserModel = require('../../models/userModel');
require('../../utils/envSetup').config();
const asyncWrapper = require('../../middleware/controllerWrapper');
const { validatePassword } = require('../../validation/validation');
const { unHashPassword, hashedPassword } = require('../../auth/password');
const userModel = require('../../models/userModel');
// resets user password
const resetPassword = asyncWrapper(async (req, res, next) => {
  // get data from req body
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.params.userId;
  let errors = [];
  // check logged in user
  if (req.user[0]) {
    console.log('start');
    //  check for empty input
    if (!oldPassword || !newPassword || !confirmPassword)
      return res.send({ error: true, msg: 'Input cannot be empty' });
    // validate passwords

    const { error } = await validatePassword({ password: oldPassword });

    if (error) return res.send({ error: true, msg: error.message });
    // get user with ID
    const user = await userModel.find({ _id: req.user[0]._id });
    console.log('find user with ID');
    console.log(user[0].password);

    if (!user) return res.send({ error: true, msg: 'user not found' });
    const decryptedPassword = await unHashPassword(
      oldPassword,
      user[0].password
    );
    console.log(decryptedPassword);
    // logs if compare returns false
    if (!decryptedPassword)
      return res.send({ error: true, msg: 'Invalid Password!' });
    // check equality
    if (newPassword !== confirmPassword)
      return res.send({ error: true, msg: "password doesn't match" });
    // hash password
    const encryptedPassword = await hashedPassword(confirmPassword);
    // update password
    const updatePassword = await userModel.findOneAndUpdate(
      { _id: req.user[0]._id },
      { password: encryptedPassword },
      { new: true }
    );

    // log user out
    req.logout(function (error) {
      if (error) {
        req.next(error);
      }
      // TODO: flash message not implemented yet
      req.flash('success_msg', 'Please login with your new password');
      return res.redirect('/login');
    });
    console.log(updatePassword);
  }
});

module.exports = resetPassword;
