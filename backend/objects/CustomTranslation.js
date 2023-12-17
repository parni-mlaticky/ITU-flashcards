const ORMBase = require("./ORMBase");
const db = require("../database");

class CustomTranslation extends ORMBase {
  static table_name ="CustomTranslation";

  constructor({ id, author_id, article_id, start_char_index, end_char_index, content }) {
    super(id);
    this.table_name = "CustomTranslation";
    this.author_id = author_id;
    this.article_id = article_id;
    this.start_char_index = start_char_index;
    this.end_char_index = end_char_index;
    this.content = content;
  }

  static async getByAuthorId(article_id, author_id) {
    const query = `SELECT * FROM CustomTranslation WHERE article_id = ? AND author_id = ?`;
    const [rows] = await db.query(query, [article_id, author_id]);

    if (rows.length === 0) {
        return null;
    }

    return rows;
  }

  static async getAllByArticleIdWithPositions(article_id) {
    const query = `SELECT * FROM CustomTranslation WHERE article_id = ?`;
    const [rows] = await db.query(query, [article_id]);

    if (rows.length === 0) {
        return null;
    }

    return rows;
  }

  static async getAllByArticleId(article_id) {
    const query = `SELECT DISTINCT ct.author_id, ru.username FROM CustomTranslation ct JOIN RegisteredUser ru ON ct.author_id = ru.id  WHERE article_id = ? GROUP BY ct.author_id, ru.username;`;
    const [rows] = await db.query(query, [article_id]);

    if (rows.length === 0) {
        return null;
    }
    return rows;
  }

  static async getRatingOfUserOfTranslationOfAuthorOnArticle(author_id, rater_id, article_id){
    const query = `SELECT rating FROM TranslationRating WHERE author_id = ? AND rater_id = ? AND article_id = ?`;
    const [rows] = await db.query(query, [author_id, rater_id, article_id]);

    if (rows.length === 0) {
        return null;
    }
    return rows[0].rating;
  }
}

module.exports = CustomTranslation;
