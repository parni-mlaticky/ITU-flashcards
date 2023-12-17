const express = require("express");
const router = express.Router();
const groupsRoute = require("./groups");
const authRoute = require("./auth");
const articlesRoute = require("./articles");
const decksRoute = require("./decks");
const usersRoute = require("./users");
const marketplaceRoute = require("./marketplace");

router.use("/groups", groupsRoute);
router.use("/auth", authRoute);
router.use("/articles", articlesRoute);
router.use("/decks", decksRoute);
router.use("/users", usersRoute);
router.use("/marketplace", marketplaceRoute);

module.exports = router;
