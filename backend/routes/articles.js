const express = require("express");
const router = express.Router();
const constants = require("../constants");
const Article = require("../objects/Article");
const CustomTranslation = require("../objects/CustomTranslation");
const DifficultyRating = require("../objects/DifficultyRating");
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


// Get all articles
router.get("/", wrapped(async (req, res) => {
    console.log("fetching articles")
    const articles = await Article.getAll();
    res.status(200).json(articles);
}));

router.post("/", upload.single("articleImg"), wrapped(async (req, res) => {
    if(req.file){
      const imagePath = req.file.path.replace(/\\/g, "/");
      req.body.image = imagePath;
      console.log("img exists", req.body.image)
    }

    const id = null;
    console.log("hello form post article", req.body)
    const article = new Article({
      id,
      heading: req.body.title,
      content: req.body.content,
      source_link: null,
      cover_image_link: req.body.image,
      author_id: req.body.author_id
    });
    const res2 = await article.save();
    console.log(res2)
    res.status(200).json(article);
}));

router.delete("/:articleId", wrapped(async (req, res) => {
    const article = await Article.getById(req.params.articleId);
    article.delete();
    res.status(200).json("Article deleted successfully");
}));

// Get a particular article
router.get("/:articleId", wrapped(async (req, res) => {
    const article = await Article.getById(req.params.articleId);
    res.status(200).json(article);
}));

// Get a particular article's total dificoulty rating
router.get("/:articleId", wrapped(async (req, res) => {
    const article = await Article.getById(req.params.articleId);
    res.status(200).json(article);
}));

// Get a prticular's article rating average
router.get("/:articleId/rating", wrapped(async (req, res) => {
    const rating = await DifficultyRating.getAverageByArticleId(
      req.params.articleId,
    );
    res.status(200).json(rating);
}));

// Get a this user's article rating average by a particular user
router.get("/:articleId/rating/:userId", wrapped(async (req, res) => {
    const rating = await DifficultyRating.getByArticleIdAndUserId(
      req.params.articleId,
      req.params.userId,
    );
    res.status(200).json(rating);
}));

// create or update this users rating
router.post("/:articleId/rating", wrapped(async (req, res) => {
    let rating = await DifficultyRating.getByArticleIdAndUserId(
      req.params.articleId,
      req.body.userId,
    );
    if (rating) {
      rating.rating = req.body.rating;
    } else {
      const id = null;
      rating = new DifficultyRating({
        id,
        article_id: Number(req.params.articleId),
        user_id: Number(req.body.userId),
        rating: req.body.rating,
      });
    }
    rating.save();
    res.status(200).json(rating);
}));

// Get a prticular's article rating average
router.delete("/:articleId/rating", wrapped(async (req, res) => {
  console.log("Hello from delete rating", req.body.userId);
    const rating = await DifficultyRating.getByArticleIdAndUserId(
      req.params.articleId,
      req.body.userId,
    );
    rating.delete();
    res.status(200).json("Difficulty rating deleted");
}));

// Get all translations for this article
router.get("/:articleId/translation", wrapped(async (req, res) => {
  console.log("Hello from get all translations", req.params.articleId)
    const translations = await CustomTranslation.getAllByArticleId(
      req.params.articleId,
    );
    console.log(translations)
    res.status(200).json(translations);
}));

// Get all translations for this article
router.get("/:articleId/translation/position", wrapped(async (req, res) => {
  console.log("Hello from get all translations", req.params.articleId)
    const translations = await CustomTranslation.getAllByArticleIdWithPositions(
      req.params.articleId,
      req.params.start,
      req.params.end
    );
    console.log(translations)
    res.status(200).json(translations);
}));

// Get a particular articles translation made by a particular user
router.get("/:articleId/translation/:authorId", wrapped(async (req, res) => {
  console.log("Getting translation for user", req.params.authorId)
  console.log("Article", req.params.articleId)
    const translation = await CustomTranslation.getByAuthorId(
      req.params.articleId,
      req.params.authorId,
    );
    res.status(200).json(translation);
}));

// Create a new translation of a particular article
router.post("/:articleId/translation", wrapped(async (req, res) => {
  const id = null;
  const article_id = req.params.articleId;
    const translation = new CustomTranslation({
      id,
      author_id: req.user.id,
      article_id,
      ...req.body,
    });
    await translation.save();
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

// Delete all translations of a particular article of user
router.post("/:articleId/translation/delete", wrapped(async (req, res) => {
    const translations = await CustomTranslation.getByAuthorId(req.params.articleId, req.body.userId);
    console.log(translations)
    translations.map((translation) => new CustomTranslation(translation).delete());
    res.status(200).json("Translation deleted successfully");
}));

// Delete a list of translations
router.post("/:articleId/translation/delete/:translationId", wrapped(async (req, res) => {
  console.log("Hello from delete translation", req.params.articleId)
  const translation = await CustomTranslation.getById(req.params.translationId);
  console.log(translation)
  translation.delete();
  res.status(200).json("Translation deleted successfully");
}));

router.get("/:articleId/comments", wrapped(async (req, res) => {
    console.log("Hello from get comments", req.params.articleId)
    const comments = await Article.getComments(req.params.articleId);
    console.log(comments)
    res.status(200).json(comments);
}));


router.post("/:articleId/comments", wrapped(async (req, res) => {
    console.log("Hello from post comments", req.params.articleId)
    const comment = await Article.postComment(req.params.articleId, req.body.userId, req.body.comment);
    console.log(comment)
    res.status(200).json(comment);
}));


module.exports = router;
