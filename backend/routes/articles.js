const express = require("express");
const router = express.Router();
const constants = require("../constants");
const articleModel = require("../models");

router.get("/", async (req, res) => {
  try {
    const articles = await articleModel.getAll();
    res.status(200).json(articles);
  } catch (err) {
    console.log(err);
    const message = "Error getting articles";
    res.status(500, message);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const article = await articleModel.getById(req.params.id);
    res.status(200).json(article);
  } catch (err) {
    console.log(err);
    const message = "Error getting article";
    res.status(500, message);
  }
});

router.get("/:id/:userId/translation", async (req, res) => {
  try {
    const translation = await articleModel.getTranslation(
      req.params.id,
      req.params.userId,
    );
    res.status(200).json(translation);
  } catch (err) {
    console.log(err);
    const message = "Error getting translation";
    res.status(500, message);
  }
});

router.post("/:id/translation", async (req, res) => {
  try {
    const translation = await articleModel.createTranslation(
      req.params.id,
      req.user,
    );
    res.status(200).json(translation);
  } catch (err) {
    console.log(err);
    const message = "Error creating translation";
    res.status(500, message);
  }
});

router.put("/:id/translation", async (req, res) => {
  try {
    const { newTranslation } = req.body;
    const translation = await articleModel.updateTranslation(
      req.user.id,
      req.params.translationId,
      newTranslation,
    );
    res.status(200).json(translation);
  } catch (err) {
    console.log(err);
    const message = "Error updating translation";
    res.status(500, message);
  }
});

router.delete("/:id/translation", async (req, res) => {
  try {
    const translation = await articleModel.deleteTranslation(
      req.params.id,
      req.user.id,
    );
    res.status(200, "Translation deleted successfully");
  } catch (err) {
    console.log(err);
    const message = "Error deleting translation";
    res.status(500, message);
  }
});

module.exports = router;
