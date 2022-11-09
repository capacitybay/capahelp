const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { loginValidation } = require('../validation/validation');

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const validateData = { email, password };
    const { error } = loginValidation(validateData);
    if (error) return done(null, false, { message: error.message });
    const user = await getUserByEmail(email);
    // console.log(e);
    if (user == null) {
      return done(null, false, { message: 'Invalid Credentials' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect Username or Password' });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    // console.log(await getUserById(id));
    return done(null, await getUserById(id));
  });
}

module.exports = initialize;

// const LocalStrategy = require('passport-local').Strategy;

// const bcrypt = require('bcrypt');

// const UserModel = require('../models/userModel');

// module.exports = function (passport) {
//   passport.use(
//     new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
//       // Match user
//       console.log(';;;;;;;;;;;;;;;');
//       console.log(email, password);
//       UserModel.findOne({
//         email: email,
//       }).then((user) => {
//         if (!user) {
//           return done(null, false, { message: 'That email is not registered' });
//         }

//         // Match password
//         bcrypt.compare(password, user.password, (err, isMatch) => {
//           if (err) throw err;
//           if (isMatch) {
//             return done(null, user);
//           } else {
//             return done(null, false, { message: 'Password incorrect' });
//           }
//         });
//       });
//     })
//   );

//   passport.serializeUser(function (user, done) {
//     done(null, user.id);
//   });

//   passport.deserializeUser(function (id, done) {
//     User.findById(id, function (err, user) {
//       done(err, user);
//     });
//   });
// };
