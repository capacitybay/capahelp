module.exports = {
  // checks if user is authenticated
  ensureAuthenticated: function (req, res, next) {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      // console.log(req.user[0].user_type);
      return next();
    }
    // redirects user to login page if not authenticated
    req.flash('error_msg', 'Please log in ');
    return res.redirect('/login');
  },
  // checks if user is logged in
  forwardAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      //   console.log(!req.isAuthenticated());
      if (req.user[0].user_type === 3 && req.user[0].active === true) {
        // if user is admin - user is redirected to the admin dashboard
        return res.redirect('/admin/dashboard');
      } else if (req.user[0].user_type === 1 && req.user[0].active === true) {
        // checks if user is customer
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
    // redirects to access denied page
    res.status(304).redirect('/error');
  },
  // checks if user is agent (not implemented yet)
  isAgent: function (req, res) {
    if (req.isAuthenticated() && req.user[0].user_type === 1) {
      return next();
    }
    res.status(304).redirect('/error');
  },
};
