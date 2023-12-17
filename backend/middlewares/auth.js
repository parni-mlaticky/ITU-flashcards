/*
 *  @author: Petr Kolouch xkolou05
 *  @project: ITU 2023
 *  @file: auth.js
 *  @brief: Authentication middleware
 */

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    req.user = {};
    req.user.id = -1;
    return next();
  }
  if (req.user) return next();

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      req.user = {};
      req.user.id = -1;
      return next();
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
