const UserModel = require('../../models/userModel');
require('../../utils/envSetup').config();
const asyncWrapper = require('../../middleware/controllerWrapper');
const { validatePassword } = require('../../validation/validation');
const { unHashPassword, hashedPassword } = require('../../auth/password');

const resetPassword = asyncWrapper(async (req, res) => {
  console.log(req.body);
  let errors = [];
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // console.log(oldPassword, newPassword, confirmNewPassword);
  if (!oldPassword || !newPassword || !confirmPassword) {
    errors.push({ msg: 'input fields must not be empty!' });
  }
  console.log(req.user);
  if (errors.length > 0) {
    res.render('resetPassword.ejs', {
      user: req.user[0],
      errors,
      oldPassword,
      newPassword,
      confirmPassword,
    });

    // gets user id from application state
    const user = await UserModel.findOne({ _id: req.params.userId });
    // checks if a user is found
    console.log(req.user[0]);
    if (!user) {
      errors.push({ msg: 'user not found!' });
      res.render('resetPassword', {
        user: req.user[0],
        errors,
        oldPassword,
        newPassword,
        confirmNewPassword,
      });
    } else {
      // decrypts the password and check if the given password matches the one in db
      const decryptedPassword = await unHashPassword(
        oldPassword,
        user.password
      );

      if (decryptedPassword) {
        // redirect to reset password page

        // validate newPassword

        const { error } = await validatePassword({
          password: newPassword,
        });

        if (error) return errors.push({ msg: error.message });

        if (newPassword !== confirmNewPassword)
          return errors.push({ msg: 'password not the same' });

        const hashPassword = await hashedPassword(newPassword); //not handled

        const updatePassword = await UserModel.updateOne(
          { _id: req.params.userId }, //work on this
          { password: hashPassword }
        );
        if (updatePassword.modifiedCount)
          return res
            .status(200)
            .json({ success: true, payload: updatePassword });
      } else {
        return errors.push({ msg: 'not a valid password' });
      }
    }
  }
});

module.exports = resetPassword;
