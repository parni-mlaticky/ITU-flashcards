const express = require("express");
const router = express.Router();
const constants = require("../constants");
const User = require("../objects/RegisteredUser");
const Group = require("../objects/LearningGroup");
const wrapped = require("./errorWrapper");

// Get a particular user's information
router.get("/name/:userId", wrapped(async (req, res) => {
  const name = await User.getUsername(req.params.userId);
  res.status(200).json(name);
}));

router.get("/groups/:userId", wrapped(async (req, res) => {
  const groups = await Group.getGroupsByUserId(req.params.userId);
  res.status(200).json(groups);
}));

module.exports = router;
