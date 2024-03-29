const ORMBase = require("./ORMBase");
const db = require("../database");

class DifficultyRating extends ORMBase {
  static table_name ="DifficultyRating";

  constructor({ id, article_id, user_id, rating }) {
    super(id);
    this.table_name = "DifficultyRating";
    this.article_id = article_id;
    this.user_id = user_id;
    this.rating = rating;
  }

  static async getAverageByArticleId(article_id) {
    const query = "SELECT AVG(rating) as avg FROM DifficultyRating WHERE article_id = ?";
    const [rows] = await db.query(query, [article_id]);
    return rows.length ? rows[0] : 0;
  }

  static async getByArticleIdAndUserId(article_id, user_id) {
    const query =
      "SELECT * FROM DifficultyRating WHERE article_id = ? AND user_id = ?";
    const [rows] = await db.query(query, [article_id, user_id]);
    if (rows.length == 0) {
      return null;
    }
    return new this(rows[0]);
  }
}

module.exports = DifficultyRating;
