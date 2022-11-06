const { loginValidation } = require('../../validation/validation');
const { unHashPassword } = require('../../auth/password');
const UserModel = require('../../models/userModel');
const RefreshTokenModel = require('../../models/refreshTokenModel');
require('../../utils/envSetup');
const { jwt } = require('../../utils/packages');
const controllerWrapper = require('../../middleware/controllerWrapper');
const passport = require('passport');
const {
  CustomError,
  createCustomError,
} = require('../../middleware/customError');
const initializePassport = require('../../middleware/passportConfig');

// initializePassport(
//   passport,
//   (email) => UserModel.findOne({ email: email }),
//   (id) => UserModel.find({ _id: id })
// );

let refreshTokenStore = [];

const loginController = controllerWrapper(async (req, res, next) => {
  // console.log(req.body);
  // send request data to the validation function
  // const { error } = loginValidation(req.body);
  // checks if error occurred during the validation process
  // if (error)
  //   return res.status(400).render('login.ejs', { message: error.message });
  passport.authenticate('local', {
    successRedirect: '/api/v1/',
    failureRedirect: '/api/v1/login',
    failureFlash: true,
  });
  // res.render('login.ejs', { message: ' Invalid login credentials!' });
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
  // console.log('.........');

  // get refresh token from logged user
  const refreshToken = req.body.token;

  // send error message if refresh token was not found
  if (!refreshToken)
    return res
      .status(401)
      .json({ success: false, payload: 'you are not authenticated' });

  RefreshTokenModel.findOne({
    refreshToken: refreshToken,
  })

    .then((result) => {
      // console.log(result);
      if (!result)
        return res
          .status(404)
          .json({ success: false, payload: 'No token found' });
      if (result.refreshToken !== refreshToken)
        return res
          .status(403)
          .json({ success: false, payload: 'refresh token is not valid..!' });
      // decode jwt token
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRETE,
        (error, user) => {
          // logs error msg to the console if error occurs
          error && console.log(error.message);

          // generate new tokens
          const newJwtAccessToken = generateJwtAccessToken(user);
          const newJwtRefreshAccessToken = generateJwtRefreshToken(user);
          // refreshTokenStore;

          // update token store
          RefreshTokenModel.findOneAndUpdate(
            {
              user_id: user.id,
            },
            { refreshToken: newJwtRefreshAccessToken },
            { new: true }
          )
            .then((response) => {
              res.status(200).json({
                success: true,
                payload: {
                  accessToken: newJwtAccessToken,
                  refreshToken: newJwtRefreshAccessToken,
                  dbToken: response,
                },
              });
            })
            .catch((error) => {
              createCustomError(error.message, 500);
            });
        }
      );
    })
    .catch((error) => {
      console.log(error.message);
    });
};

module.exports = { loginController, refreshUserToken };
