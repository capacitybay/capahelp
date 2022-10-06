const UserModel = require("../../models/userModel");
require("../../utils/envSetup").config();

const { validatePassword } = require("../../validation/validation");
const { unHashPassword, hashedPassword } = require("../../auth/password");

const resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    // console.log(oldPassword, newPassword, confirmNewPassword);
    if (!oldPassword || !newPassword || !confirmNewPassword)
      return res
        .status(400)
        .json({ success: false, result: "input fields must not be empty!" });

    const user = await UserModel.findOne({ _id: req.params.userId });
    // checks if a user is found
    if (user) {
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

        if (error)
          return res
            .status(400)
            .json({ success: false, result: error.message });

        if (newPassword !== confirmNewPassword)
          return res
            .status(400)
            .json({ success: false, result: "password not the same" });

        const hashPassword = await hashedPassword(newPassword); //not handled

        const updatePassword = await UserModel.updateOne(
          { _id: req.params.userId }, //work on this
          { password: hashPassword }
        );
        if (updatePassword.acknowledged)
          return res
            .status(200)
            .json({ success: true, result: updatePassword });
      } else {
        res
          .status(400)
          .json({ success: false, result: "not a valid password" });
      }
    } //no else
  } catch (error) {
    res.status(500).json({
      success: false,
      result: error.message,
    });
  }
};

module.exports = resetPassword;
