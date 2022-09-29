const jwt = require("jsonwebtoken");
require("dotenv").config();

// verifies if the user is authenticated or not
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;
  console.log(authHeader);
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json("You are not authorized to access this route");
  }

  jwt.verify(token, process.env.SECRETE, (error, result) => {
    if (error) return res.status(403).json("invalid token");
    req.user = result;
    console.log(result);
    next();
  });
};

module.exports = authenticateToken;
