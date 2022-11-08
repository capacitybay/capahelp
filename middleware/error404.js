const error404 = (req, res, next) => {
  return res.status(404).render('error404.ejs');
  // return res
  //   .status(404)
  //   .json({ success: false, payload: "Resource doesn't exist " });
};

module.exports = error404;
