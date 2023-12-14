const express = require("express");
const router = express.Router();
const constants = require("../constants");
const FlashcardDeck = require("../objects/FlashcardDeck");
const Flashcard = require("../objects/Flashcard");

// Returns a list of all user's decks
router.get("/", async (req, res) => {
  try {
    const decks = await FlashcardDeck.getAllByAuthor(req.user.id);
    res.status(200).json(decks);
  } catch (err) {
    console.log(err);
    const message = "Error getting decks";
    res.status(500, message);
  }
});

// Create a new deck
router.post("/", async (req, res) => {
  try {
    const { author_id, name, description } = req.body;
    let deck = FlashcardDeck({ null, author_id, name, description });
    deck = await deck.save();
    res.status(200).json(deck);
  } catch (err) {
    console.log(err);
    const message = "Error creating deck";
    res.status(500, message);
  }
});

// Get particular deck by id
router.get("/:deckId", async (req, res) => {
  try {
    const deck = await FlashcardDeck.getById(req.params.deckId);
    res.status(200).json(deck);
  } catch (err) {
    console.log(err);
    const message = "Error getting deck";
    res.status(500, message);
  }
});

// Update particular deck by id
router.put("/:deckId", async (req, res) => {
  try {
    let deck = FlashcardDeck({ req.params.deckId, ...req.body });
    deck = await deck.save();
    res.status(200).json(deck);
  } catch (err) {
    console.log(err);
    const message = "Error updating deck";
    res.status(500, message);
  }
});

// Delete a particular deck by id
router.delete("/:deckId", async (req, res) => {
  try {
    const deck = await FlashcardDeck.getById(req.params.id);
    deck.delete();
    res.status(200, "Deck deleted successfully");
  } catch (err) {
    console.log(err);
    const message = "Error deleting deck";
    res.status(500, message);
  }
});


/* Cards */

// Get a list of all cards
router.get("/:deckId/cards", async (req, res) => {
  try {
    const cards = await Flashcard.getAllInDeck(req.params.id);
    res.status(200).json(cards);
  } catch (err) {
    console.log(err);
    const message = "Error getting cards";
    res.status(500, message);
  }
});

// Create a card
router.post("/:deckId/cards", async (req, res) => {
  try {
    req.body.deck_id = req.params.deckId;
    let card = Flashcard({ null, ...req.body });
    card = await card.save();
    res.status(200).json(card);
  } catch (err) {
    console.log(err);
    const message = "Error creating card";
    res.status(500, message);
  }
});

// Edit a card
router.put("/:deckId/cards/:cardId", async (req, res) => {
  try {
    req.body.deck_id = req.params.deckId;
    let card = Flashcard({ req.params.cardId, ...req.body });
    card = card.save();
    res.status(200).json(card);
  } catch (err) {
    console.log(err);
    const message = "Error updating card";
    res.status(500, message);
  }
});

router.delete("/:deckId/cards/:cardId", async (req, res) => {
  try {
    const deck = await Flashcard.getById(req.params.cardId);
    deck.delete();
    res.status(200, "Card deleted successfully");
  } catch (err) {
    console.log(err);
    const message = "Error deleting card";
    res.status(500, message);
  }
});

module.exports = router;
