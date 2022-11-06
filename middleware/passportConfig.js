const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = await getUserByEmail(email);
    console.log(email, password);
    if (user == null) {
      return done(null, false, { message: 'No user with that email' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
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
