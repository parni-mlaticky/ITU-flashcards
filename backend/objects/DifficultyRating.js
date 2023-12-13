const ORMBase = require("./ORMBase");

class DifficultyRating extends ORMBase {
  constructor(id, article_id, user_id, rating) {
    super(id);
    this.article_id = article_id;
    this.user_id = user_id;
    this.rating = rating;
  }
}

module.exports = DifficultyRating;
