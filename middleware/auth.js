module.exports = {
  ensureAuthenticated: function (req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      // console.log(req.user[0].user_type);
      return next();
    }
    req.flash('error_msg', 'Please log in ');
    return res.redirect('/login');
  },
  forwardAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      //   console.log(!req.isAuthenticated());
      if (req.user[0].user_type === 3) {
        return res.redirect('/admin/dashboard');
      } else if (req.user[0].user_type === 1) {
        // dev still in progress
        return res.redirect('/');
      } else {
        return res.redirect('/user');
      }
    }
    next();
  },
  // checks if user is admin
  isAdmin: function (req, res, next) {
    if (req.isAuthenticated() && req.user[0].user_type === 3) {
      return next();
    }
    res.status(304).redirect('/error');
  },
  isAgent: function (req, res) {
    if (req.isAuthenticated() && req.user[0].user_type === 1) {
      return next();
    }
    res.status(304).redirect('/error');
  },
};
