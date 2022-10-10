const { loginValidation } = require('../../validation/validation');
const { unHashPassword } = require('../../auth/password');
const UserModel = require('../../models/userModel');
require('../../utils/envSetup');
const { jwt } = require('../../utils/packages');
const controllerWrapper = require('../../middleware/controllerWrapper');

let refreshTokenStore = [];

const loginController = controllerWrapper(async (req, res) => {
  // send request data to the validation function
  const { error } = loginValidation(req.body);
  // checks if error occurred during the validation process
  if (error) {
    res.status(400).json(error.message);
  } else {
    // queries the database with the provided email

    const user = await UserModel.findOne({ email: req.body.email });
    // console.log(user);

    // checks if the query returned true
    if (user) {
      // unHashes the password from the database
      const decryptedPassword = await unHashPassword(
        req.body.password,
        user.password
      );
      // console.log(user._id.valueOf());

      // checks if the unHashing was successful
      // console.log({ user });
      if (decryptedPassword) {
        // sign jwt token token
        const accessToken = generateJwtAccessToken(user);
        const refreshToken = generateJwtRefreshToken(user);
        refreshTokenStore.push(refreshToken);
        res.status(200).json({
          success: true,
          payload: { user, accessToken, refreshToken },
        });

        // sends cookie to the frontend
        // res.cookie("Token", token, {
        //   httpOnly: true,
        //   // cookie will expire in 5 mins
        //   maxAge: 5 * 60000,
        // });
        // console.log(res);
      } else {
        res.status(401).json('invalid email or password');
      }
    } else {
      // sends error message if email match returns false
    }
  }
});

const generateJwtAccessToken = (user) => {
  // console.log(user);
  return jwt.sign(
    {
      id: user.id,
      user_type: user.user_type,
      email: user.email,
    },
    process.env.JWT_SECRETE,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};
const generateJwtRefreshToken = (user) => {
  console.log(user);

  return jwt.sign(
    {
      id: user.id,
      user_type: user.user_type,
      email: user.email,
    },
    process.env.JWT_REFRESH_TOKEN_SECRETE
  );
};

const refreshUserToken = (req, res) => {
  // get refresh token from logged user
  const refreshToken = req.body.token;

  // send error message if refresh token was not found
  if (!refreshToken)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated' });
  if (!refreshTokenStore.includes(refreshToken)) {
    return res
      .status(403)
      .json({ success: false, payload: 'refresh token is not valid!' });
  }
  jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRETE,
    (error, user) => {
      // console.log(` callback ${user}`);

      // logs error msg to the console if error occurs
      error && console.log(error.message);

      refreshTokenStore = refreshTokenStore.filter(
        (token) => token !== refreshToken
      );
      const newJwtAccessToken = generateJwtAccessToken(user);
      const newJwtRefreshAccessToken = generateJwtRefreshToken(user);
      // refreshTokenStore;
      refreshTokenStore.push(newJwtRefreshAccessToken);
      res.status(200).json({
        success: true,
        payload: {
          accessToken: newJwtAccessToken,
          refreshToken: newJwtRefreshAccessToken,
        },
      });
    }
  );
};

module.exports = { loginController, refreshUserToken };
