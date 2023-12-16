const express = require("express");
const router = express.Router();
const constants = require("../constants");
const User = require("../objects/RegisteredUser");
const wrapped = require("./errorWrapper");

// Get a particular user's information
router.get("/name/:userId", wrapped(async (req, res) => {
  const name = await User.getUsername(req.params.userId);
  res.status(200).json(name);
}));

module.exports = router;
