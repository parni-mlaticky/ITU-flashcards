const express = require("express");
const router = express.Router();
const constants = require("../constants");
const Article = require("../objects/Article");
const CustomTranslation = require("../objects/CustomTranslation");
const DifficultyRating = require("../objects/DifficultyRating");
const wrapped = require("./errorWrapper");

// Get all articles
router.get("/", wrapped(async (req, res) => {
    const articles = await Article.getAll();
    res.status(200).json(articles);
}));

// Get a particular article
router.get("/:articleId", wrapped(async (req, res) => {
    const article = await Article.getById(req.params.articleId);
    res.status(200).json(article);
}));

// Get a particular article's total dificoulty raiting
router.get("/:articleId", wrapped(async (req, res) => {
    const article = await Article.getById(req.params.articleId);
    res.status(200).json(article);
}));

// Get a prticular's article raiting average
router.get("/:articleId/rating", wrapped(async (req, res) => {
    const raiting = await DifficultyRating.getAverageByArticleId(
      req.params.articleId,
    );
    res.status(200).json(raiting);
}));

// Get a this user's article raiting average by a particular user
router.get("/:articleId/rating/:userId", wrapped(async (req, res) => {
    const rating = await DifficultyRating.getByArticleIdAndUserId(
      req.params.articleId,
      req.user.id,
    );
    res.status(200).json(rating);
}));

// create or update this users raiting
router.post("/:articleId/rating", wrapped(async (req, res) => {
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
}));

// Get a prticular's article raiting average
router.delete("/:articleId/rating", wrapped(async (req, res) => {
    const raiting = await DifficultyRating.getByArticleIdAndUserId(
      req.params.articleId,
      req.user.id,
    );
    raiting.delete();
    res.status(200).json("Difficoulty raiting deleted");
}));

// Get a particular articles translation made by a particular user
router.get("/:articleId/translation/:authorId", wrapped(async (req, res) => {
    const translation = await CustomTranslation.getByAuthorId(
      req.params.articleId,
      req.params.userId,
    );
    res.status(200).json(translation);
}));

// Create a new translation of a particular article
router.post("/:articleId/translation", wrapped(async (req, res) => {
  const id = null;
  const article_id = req.params.articleId;
    const translation = await CustomTranslation({
      id,
      author_id: req.user.id,
      article_id,
      ...req.body,
    });
    res.status(200).json(translation);
}));

// Edit this user's transaltion of a particular article
router.put("/:articleId/translation", wrapped(async (req, res) => {
    // Querying to geth id of existing article
    const translation = CustomTranslation.getByAuthorId();
    let updated = await ArticleModel.updateTranslation({});
    updated = updated.save();
    res.status(200).json(updated);
}));

// Delete translation of a particular article
router.delete("/:articleId/translation", wrapped(async (req, res) => {
    // Querying to geth id of existing article
    const article = CustomTranslation.getByAuthorId();
    const translation = await CustomTranslation({});
    translation.delete();
    res.status(200, "Translation deleted successfully");
}));

module.exports = router;
