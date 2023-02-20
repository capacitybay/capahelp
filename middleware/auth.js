module.exports = {
  // checks if user is authenticated
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    // redirects user to login page if not authenticated
    req.flash('error_msg', 'Please Log In With Your Credentials');
    return res.status(304).redirect('/login');
  },
  // checks if user is logged in
  forwardAuthenticated: function (req, res, next) {
    console.log(req.isAuthenticated());

    if (req.isAuthenticated()) {
      if (
        (req.user.user_type === 3 && req.user.active === true) ||
        (req.user[0]?.user_type === 3 && req.user[0]?.active === true)
      ) {
        // if user is admin - user is redirected to the admin dashboard
        return res.redirect('/admin/dashboard');
      } else if (req.user.user_type === 1 && req.user.active === true) {
        console.log(req.user);
        // checks if user is customer
        // dev still in progress
        return res.redirect('/');
      } else if (
        (req.user.user_type === 0 && req.user.active === true) ||
        (req.user[0]?.user_type === 0 && req.user[0]?.active === true)
      ) {
        return res.redirect('/user');
      }
    }
    return next();
  },
  // checks if user is admin
  isAdmin: function (req, res, next) {
    console.log('req.isAuthenticated()');

    console.log(req.user);
    if (!req.isAuthenticated()) return res.redirect('/login');
    if (req.user[0].user_type === 3) {
      //res.status(304).redirect('/login');

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
    return res.status(304).redirect('/error');
  },
};
