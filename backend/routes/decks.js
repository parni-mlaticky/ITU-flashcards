const express = require("express");
const router = express.Router();
const constants = require("../constants");
const FlashcardDeck = require("../objects/FlashcardDeck");
const Flashcard = require("../objects/Flashcard");
const wrapped = require("./errorWrapper");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // The path to where the file will be saved
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

const upload = multer({ storage: storage });

// Returns a list of all user's decks
router.get(
  "/",
  wrapped(async (req, res) => {
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
    let deck = new FlashcardDeck({ id, author_id, name, description });
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
    let deck = new FlashcardDeck({ id, ...req.body });
    deck = await deck.save();
    res.status(200).json(deck);
  }),
);

// Delete a particular deck by id
router.delete(
  "/:deckId",
  wrapped(async (req, res) => {
    const deck = await FlashcardDeck.getById(req.params.deckId);
    await deck.delete();
    return res.status(204).send({});
  }),
);

// Get a list of all cards
router.get(
  "/:deckId/cards",
  wrapped(async (req, res) => {
    const cards = await Flashcard.getAllInDeck(req.params.deckId);
    res.status(200).json(cards);
  }),
);

// Get a particular card
router.get(
  "/:deckId/cards/:cardId",
  wrapped(async (req, res) => {
    const card = await Flashcard.getById(req.params.cardId);

    res.status(200).json(card);
  }),
);

// Create a card
router.post(
  "/:deckId/cards",
  upload.single("image"),
  wrapped(async (req, res) => {
    const id = null;
    req.body.deck_id = req.params.deckId;

    if (req.file) {
      const imagePath = req.file.path.replace(/\\/g, "/");
      req.body.image = imagePath;
    }

    let card = new Flashcard({ id, ...req.body });
    card = await card.save();
    res.status(200).json(card);
  }),
);

// Edit a card
router.put(
  "/:deckId/cards/:cardId",
  wrapped(async (req, res) => {
    const id = req.params.cardId;
    req.body.deck_id = req.params.deckId;
    let card = new Flashcard({ id, ...req.body });
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
    res.status(200).send({});
  }),
);

module.exports = router;

// async function main() {
//   fetch("localhost:3000/decks/1/cards/1");
// }

// main()
