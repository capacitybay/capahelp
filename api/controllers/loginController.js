const { loginValidation } = require('../../validation/validation');
const { unHashPassword } = require('../../auth/password');
const UserModel = require('../../models/userModel');
const RefreshTokenModel = require('../../models/refreshTokenModel');
require('../../utils/envSetup');
const { jwt } = require('../../utils/packages');
const controllerWrapper = require('../../middleware/controllerWrapper');
const {
  CustomError,
  createCustomError,
} = require('../../middleware/customError');

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

      // checks if the unHashing was successful

      if (decryptedPassword) {
        /**not implemented this feature yet
         * if(user.user_type === 3){
         * console.log("route to admin page ")
         * }else{
         * console.log("route to customer page ")
         * }
         */

        // sign jwt token token
        const accessToken = generateJwtAccessToken(user);
        const refreshToken = generateJwtRefreshToken(user);
        // const savedToken = new RefreshTokenModel.
        refreshTokenStore.push(refreshToken);
        const dbTokenStore = await RefreshTokenModel.findOneAndUpdate(
          {
            user_id: user._id,
          },
          { refreshToken: refreshToken },
          { new: true }
        );
        res.status(200).json({
          success: true,
          payload: { user, accessToken, refreshToken, dbTokenStore },
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
