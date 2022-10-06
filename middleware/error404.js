const error404 = (req, res) => {
  return res
    .status(404)
    .json({ success: false, payload: "Resource doesn't exist " });
};

module.exports = error404;
