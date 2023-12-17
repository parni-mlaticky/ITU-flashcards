const express = require("express");
const router = express.Router();
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
    const { author_id, name, description, isShared } = req.body;
    let id = null;
    let deck = new FlashcardDeck({
      id,
      author_id,
      name,
      description,
      is_shared: isShared,
    });
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

router.post(
  "/:deckId/copy",
  wrapped(async (req, res) => {
    try {
      const originalDeckId = req.params.deckId;
      const userId = req.user.id;

      const originalDeck = await FlashcardDeck.getById(originalDeckId);
      const originalCards = await Flashcard.getAllInDeck(originalDeckId);

      const newDeck = new FlashcardDeck({
        author_id: userId,
        name: originalDeck.name,
        description: originalDeck.description,
        is_shared: false,
      });
      await newDeck.save();

      for (const card of originalCards) {
        const newCard = new Flashcard({
          deck_id: newDeck.id,
          front: card.front,
          back: card.back,
          image: card.image,
        });
        await newCard.save();
      }
      res.status(200).json(newDeck);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error copying deck");
    }
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
