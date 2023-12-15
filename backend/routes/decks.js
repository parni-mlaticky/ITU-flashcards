const express = require("express");
const router = express.Router();
const constants = require("../constants");
const FlashcardDeck = require("../objects/FlashcardDeck");
const Flashcard = require("../objects/Flashcard");
const wrapped = require("./errorWrapper");

// Returns a list of all user's decks
router.get(
  "/",
  wrapped(async (req, res) => {
    console.log("xd");
    const decks = await FlashcardDeck.getAllByAuthor(req.user.id);
    res.status(200).json(decks);
  }, "Error getting decks"),
);

// Create a new deck
router.post(
  "/",
  wrapped(async (req, res) => {
    const { author_id, name, description } = req.body;
    let id = null;
    let deck = FlashcardDeck({ id, author_id, name, description });
    deck = await deck.save();
    res.status(200).json(deck);
  }),
);

router.get(
  "/:deckId",
  wrapped(async (req, res) => {
    const deck = await FlashcardDeck.getById(req.params.deckId);
    res.status(200).json(deck);
  }),
);

// Update particular deck by id
router.put(
  "/:deckId",
  wrapped(async (req, res) => {
    const id = req.params.deckId;
    const deck = FlashcardDeck({ id, ...req.body });
    deck = await deck.save();
    res.status(200).json(deck);
  }),
);

// Delete a particular deck by id
router.delete(
  "/:deckId",
  wrapped(async (req, res) => {
    const deck = await FlashcardDeck.getById(req.params.id);
    deck.delete();
    res.status(200, "Deck deleted successfully");
  }),
);

// Get a list of all cards
router.get(
  "/:deckId/cards",
  wrapped(async (req, res) => {
    const cards = await Flashcard.getAllInDeck(req.params.id);
    res.status(200).json(cards);
  }),
);

// Create a card
router.post(
  "/:deckId/cards",
  wrapped(async (req, res) => {
    const id = null;
    const card = Flashcard({ id, ...req.body });
    card = await card.save();
    res.status(200).json(card);
  }),
);

// Edit a card
router.put(
  "/:deckId/cards/:cardId",
  wrapped(async (req, res) => {
    const id = req.params.cardId;
    const card = Flashcard({ id, ...req.body });
    card = card.save();
    res.status(200).json(card);
  }),
);

// Delete a card
router.delete(
  "/:deckId/cards/:cardId",
  wrapped(async (req, res) => {
    const card = await Flashcard.getById(req.params.cardId);
    card.delete();
    res.status(200, "Card deleted successfully");
  }),
);

module.exports = router;

// async function main() {
//   fetch("localhost:3000/decks/1/cards/1");
// }

// main()
