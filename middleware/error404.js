const error404 = (req, res, next) => {
  res.status(404).render('Errors/error404.ejs');
  // return res
  //   .status(404)
  //   .json({ success: false, payload: "Resource doesn't exist " });
};

module.exports = error404;
