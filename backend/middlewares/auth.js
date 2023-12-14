const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  // TODO remove this after the frontend is working.
  // this is only here to test the routes
  if (token == null) {
    req.user = {};
    req.user.id = 0;
    return next();
  };
  if (req.user) return next();

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return null;
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
