const ORMBase = require("./ORMBase");

class DifficultyRating extends ORMBase {
  constructor({ id, article_id, user_id, rating }) {
    super(id);
    this.article_id = article_id;
    this.user_id = user_id;
    this.rating = rating;
  }

  static async getAverageByArticleIdAndUserId(article_id) {
    const query = "SELECT AVG(*) FROM DifficultyRaiting WHERE article_id = ?";
    const [rows] = await db.query(query[article_id]);
    return rows.length ? rows[0] : 0;
  }

  static async getByArticleIdAndUserId(article_id, user_id) {
    const query =
      "SELECT AVG(*) FROM DifficultyRaiting WHERE article_id = ? AND user_id = ?";
    const [rows] = await db.query(query[(article_id, user_id)]);
    if (rows.length == 0) {
      return null;
    }
    return this(rows[0]);
  }
  get table_name() { return "DifficultyRating"; }
}

module.exports = DifficultyRating;
