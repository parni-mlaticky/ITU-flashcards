const express = require("express");
const router = express.Router();
const groupsRoute = require("./groups");
const authRoute = require("./auth");
const articlesRoute = require("./articles");
const decksRoute = require("./decks");

router.use("/groups", groupsRoute);
router.use("/auth", authRoute);
router.use("/articles", articlesRoute);
router.use("/decks", decksRoute);

module.exports = router;
