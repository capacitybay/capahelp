const UserModel = require('../../models/userModel');
require('../../utils/envSetup').config();
const asyncWrapper = require('../../middleware/controllerWrapper');
const { validatePassword } = require('../../validation/validation');
const { unHashPassword, hashedPassword } = require('../../auth/password');

const resetPassword = asyncWrapper(async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  // console.log(oldPassword, newPassword, confirmNewPassword);
  if (!oldPassword || !newPassword || !confirmNewPassword)
    return res
      .status(400)
      .json({ success: false, payload: 'input fields must not be empty!' });
  // gets user id from application state
  const user = await UserModel.findOne({ _id: req.params.userId });
  // checks if a user is found
  if (!user)
    return res.status(400).json({ success: false, payload: 'user not found!' });

  // decrypts the password and check if the given password matches the one in db
  const decryptedPassword = await unHashPassword(oldPassword, user.password);

  if (decryptedPassword) {
    // redirect to reset password page

    // validate newPassword

    const { error } = await validatePassword({
      password: newPassword,
    });

    if (error)
      return res.status(400).json({ success: false, payload: error.message });

    if (newPassword !== confirmNewPassword)
      return res
        .status(400)
        .json({ success: false, result: 'password not the same' });
    result;
    const hashPassword = await hashedPassword(newPassword); //not handled

    const updatePassword = await UserModel.updateOne(
      { _id: req.params.userId }, //work on this
      { password: hashPassword }
    );
    if (updatePassword.modifiedCount)
      return res.status(200).json({ success: true, payload: updatePassword });
  } else {
    res.status(400).json({ success: false, result: 'not a valid password' });
  }
});

module.exports = resetPassword;
