const express = require("express");
const router = express.Router();
const constants = require("../constants");
const Article = require("../objects/Article");
const CustomTranslation = require("../objects/CustomTranslation");
const DifficultyRating = require("../objects/DifficultyRating");

// Get all articles
router.get("/", async (req, res) => {
  try {
    console.log("Getting articles");
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

// Get a prticular's article raiting average
router.get("/:articleId/rating", async (req, res) => {
  try {
    const raiting = await DifficultyRating.getAverageByArticleId(
      req.params.articleId,
    );
    res.status(200).json(raiting);
  } catch (err) {
    const message = "Error getting article raiting";
    res.status(500, message);
  }
});

// Get a this user's article raiting average by a particular user
router.get("/:articleId/rating/:userId", async (req, res) => {
  try {
    const rating = await DifficultyRating.getByArticleIdAndUserId(
      req.params.articleId,
      req.user.id,
    );
    res.status(200).json(rating);
  } catch (err) {
    const message = "Error getting article raiting";
    res.status(500, message);
  }
});

// create or update this users raiting
router.post("/:articleId/rating", async (req, res) => {
  try {
    let raiting = await DifficultyRating.getByArticleIdAndUserId(
      req.params.articleId,
      req.params.userId,
    );
    if (raiting) {
      raiting.raiting = req.body.raiting;
    } else {
      const id = null;
      raiting = DifficultyRating({
        id,
        article_id: req.params.articleId,
        user_id: req.params.user_id,
        rating: req.body.rating,
      });
    }
    raiting.save();
    res.status(200).json(raiting);
  } catch (err) {
    const message = "Error getting article raiting";
    res.status(500, message);
  }
});

// Get a prticular's article raiting average
router.delete("/:articleId/rating", async (req, res) => {
  try {
    const raiting = await DifficultyRating.getByArticleIdAndUserId(
      req.params.articleId,
      req.user.id,
    );
    raiting.delete();
    res.status(200).json("Difficoulty raiting deleted");
  } catch (err) {
    const message = "Error getting article raiting";
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
      ...req.body,
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
    let updated = await ArticleModel.updateTranslation({});
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
    const article = CustomTranslation.getByAuthorId();
    const translation = await CustomTranslation({});
    translation.delete();
    res.status(200, "Translation deleted successfully");
  } catch (err) {
    console.log(err);
    const message = "Error deleting translation";
    res.status(500, message);
  }
});

module.exports = router;
