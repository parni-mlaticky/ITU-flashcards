const express = require("express");
const router = express.Router();
const constants = require("../constants");
const Article = require("../objects/Article");
const CustomTranslation = require("../objects/CustomTranslation");

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.getAll();
    res.status(200).json(articles);
  } catch (err) {
    console.log(err);
    const message = "Error getting articles";
    res.status(500, message);
  }
});

// Get a particular article
router.get("/:articleId", async (req, res) => {
  try {
    const article = await Article.getById(req.params.articleId);
    res.status(200).json(article);
  } catch (err) {
    console.log(err);
    const message = "Error getting article";
    res.status(500, message);
  }
});

// Get a particular article's total dificoulty raiting
router.get("/:articleId", async (req, res) => {
  try {
    const article = await Article.getById(req.params.articleId);
    res.status(200).json(article);
  } catch (err) {
    console.log(err);
    const message = "Error getting article";
    res.status(500, message);
  }
});


// Get a particular articles translation made by a particular user
router.get("/:articleId/translation/:authorId", async (req, res) => {
  try {
    const translation = await CustomTranslation.getByAuthorId(
      req.params.articleId,
      req.params.userId,
    );
    res.status(200).json(translation);
  } catch (err) {
    console.log(err);
    const message = "Error getting translation";
    res.status(500, message);
  }
});

// Create a new translation of a particular article
router.post("/:articleId/translation", async (req, res) => {
  const id = null;
  const article_id = req.params.articleId;
  try {
    const translation = await CustomTranslation({
      id,
      author_id: req.user.id,
      article_id,
      ...req.body
    });
    res.status(200).json(translation);
  } catch (err) {
    console.log(err);
    const message = "Error creating translation";
    res.status(500, message);
  }
});

// Edit this user's transaltion of a particular article
router.put("/:articleId/translation", async (req, res) => {
  try {
    // Querying to geth id of existing article
    const translation = CustomTranslation.getByAuthorId();
    let updated = await ArticleModel.updateTranslation({

    });
    updated = updated.save();
    res.status(200).json(updated);
  } catch (err) {
    console.log(err);
    const message = "Error updating translation";
    res.status(500, message);
  }
});

// Edit this user's translation of a particular article
router.delete("/:articleId/translation", async (req, res) => {
  try {
    // Querying to geth id of existing article
    const article = CustomTranslation.getByAuthorId()
    const translation = await CustomTranslation({

    });
    translation.delete();
    res.status(200, "Translation deleted successfully");
  } catch (err) {
    console.log(err);
    const message = "Error deleting translation";
    res.status(500, message);
  }
});

module.exports = router;
