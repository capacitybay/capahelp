const { loginValidation } = require('../../validation/validation');
const { unHashPassword } = require('../../auth/password');
const UserModel = require('../../models/userModel');
require('../../utils/envSetup');
const { jwt } = require('../../utils/packages');
const controllerWrapper = require('../../middleware/controllerWrapper');
const loginController = controllerWrapper(async (req, res) => {
  // send request data to the validation function
  const { error } = loginValidation(req.body);
  // checks if error occurred during the validation process
  if (error) {
    res.status(400).json(error.message);
  } else {
    // queries the database with the provided email

    const user = await UserModel.findOne({ email: req.body.email });
    console.log(user);

    // checks if the query returned true
    if (user) {
      // unHashes the password from the database
      const decryptedPassword = await unHashPassword(
        req.body.password,
        user.password
      );
      // checks if the unHashing was successful

      if (decryptedPassword) {
        // sign jwt token token
        const token = jwt.sign(
          {
            id: user._id,
            role: user.user_type,
            email: user.email,
          },
          process.env.SECRETE,
          { expiresIn: process.env.JWT_EXPIRE }
        );
        // sends cookie to the frontend
        // res.cookie("Token", token, {
        //   httpOnly: true,
        //   // cookie will expire in 5 mins
        //   maxAge: 5 * 60000,
        // });
        // console.log(res);
        res.status(200).json({ user, jwt: token });
      } else {
        res.status(401).json('invalid email or password');
      }
    } else {
      // sends error message if email match returns false
      res.status(404).json('invalid email ');
    }
  }
});

module.exports = loginController;
