const express = require("express");
const router = express.Router();
const FlashcardDeck = require("../objects/FlashcardDeck");
const wrapped = require("./errorWrapper");

router.get(
  "/",
  wrapped(async (req, res) => {
    const decks = await FlashcardDeck.getAllShared(req.user.id);
    res.status(200).json(decks);
  }, "Error getting decks"),
);

module.exports = router;
