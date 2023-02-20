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
const initializePassport = require('../../auth/passportConfig');

initializePassport(
  passport,
  (email) => UserModel.findOne({ email: email }),
  (id) => UserModel.find({ _id: id })
);

const loginController = controllerWrapper(async (req, res, next) => {
  // not working for now
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

// not working
const refreshUserToken = (req, res) => {
  // console.log('.........');

  // get refresh token fromadmin logged user
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
