const { loginValidation } = require("../validation/validation");
const { unHashPassword } = require("../validation/password");
const UserModel = require("../../models/userModel");

const loginController = async (req, res) => {
  // send request data to the validation function
  const { error } = loginValidation(req.body);
  // checks if error occurred during the validation process
  if (error) {
    res.status(400).json(error.message);
  } else {
    try {
      // queries the database with the provided email

      const user = await UserModel.findOne({ email: req.body.email });

      // checks if the query returned true

      if (user) {
        // unHashes the password from the database
        const decryptedPassword = await unHashPassword(
          req.body.password,
          user.password
        );
        // checks if the unHashing was successful

        if (decryptedPassword) {
          // sends msg to the frontend
          res.status(200).json(`welcome back ${user.first_name}`);
        } else {
          res.status(401).json("invalid username or password");
        }
      } else {
        // sends error message if email match returns false
        res.status(401).json("invalid username ");
      }

      //
    } catch (error) {
      res.status(500).json(error.message);
    }
  }
};

module.exports = loginController;
