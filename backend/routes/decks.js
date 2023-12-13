const express = require("express");
const router = express.Router();
const constants = require("../constants");
const { deckModel, cardModel } = require("../models");

router.get("/", async (req, res) => {
  try {
    const decks = await deckModel.getAll();
    res.status(200).json(decks);
  } catch (err) {
    console.log(err);
    const message = "Error getting decks";
    res.status(500, message);
  }
});

router.post("/", async (req, res) => {
  try {
    const deck = await deckModel.create(req.body);
    res.status(200).json(deck);
  } catch (err) {
    console.log(err);
    const message = "Error creating deck";
    res.status(500, message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const deck = await deckModel.getById(req.params.id);
    res.status(200).json(deck);
  } catch (err) {
    console.log(err);
    const message = "Error getting deck";
    res.status(500, message);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const deck = await deckModel.update(req.params.id, req.body);
    res.status(200).json(deck);
  } catch (err) {
    console.log(err);
    const message = "Error updating deck";
    res.status(500, message);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deck = await deckModel.delete(req.params.id);
    res.status(200, "Deck deleted successfully");
  } catch (err) {
    console.log(err);
    const message = "Error deleting deck";
    res.status(500, message);
  }
});

/* Cards */

router.get("/:id/cards", async (req, res) => {
  try {
    const cards = await cardModel.getAll(req.params.id);
    res.status(200).json(cards);
  } catch (err) {
    console.log(err);
    const message = "Error getting cards";
    res.status(500, message);
  }
});

router.post("/:id/cards", async (req, res) => {
  try {
    const card = await cardModel.create(req.params.id, req.body);
    res.status(200).json(card);
  } catch (err) {
    console.log(err);
    const message = "Error creating card";
    res.status(500, message);
  }
});

router.put("/:id/cards/:cardId", async (req, res) => {
  try {
    const card = await cardModel.update(req.params.cardId, req.body);
    res.status(200).json(card);
  } catch (err) {
    console.log(err);
    const message = "Error updating card";
    res.status(500, message);
  }
});

router.delete("/:id/cards/:cardId", async (req, res) => {
  try {
    const card = await cardModel.delete(req.params.cardId);
    res.status(200, "Card deleted successfully");
  } catch (err) {
    console.log(err);
    const message = "Error deleting card";
    res.status(500, message);
  }
});

module.exports = router;
