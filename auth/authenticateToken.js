const jwt = require("jsonwebtoken");
require("dotenv").config();

// verifies if the user is authenticated or not
const authenticateToken = (req, res, next) => {
  // const token = req.cookies.passToken;
  console.log(req);
  // if (token) {
  //   jwt.verify(token, process.env.SECRETE_TOKEN, (err, decodedToken) => {
  //     if (err) res.json(err.message);
  //     res.status(200).send("you are  authenticated");
  //     req.user = decodedToken;
  next();
  //   });
  // } else {
  //   // res.redirect("/login");

  //   res.status(401).send("you are not authenticated");
  // }
};

module.exports = authenticateToken;
