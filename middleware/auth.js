module.exports = {
  ensureAuthenticated: function (req, res, next) {
    // console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    }
    //   req.flash('error_msg', 'Please log in to view that resource');
    console.log('error_msg', 'Please log in to view that resource');
    res.redirect('/api/v1/login');
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      //   console.log(!req.isAuthenticated());
      return next();
    }
    res.redirect('/api/v1/');
  },
};
