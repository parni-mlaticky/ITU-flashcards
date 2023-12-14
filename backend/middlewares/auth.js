const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (token == null) return null;
  if (req.user) return next();

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return null;
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
