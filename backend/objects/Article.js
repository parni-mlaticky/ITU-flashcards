const ORMBase = require("./ORMBase");
const db = require("../database");

class Article extends ORMBase {
  static table_name ="Article";
  
  constructor({ id, heading, content, source_link, cover_image_link, author_id = null }) {
    super(id);
    this.table_name = "Article";
    this.heading = heading;
    this.content = content;
    this.source_link = source_link;
    this.cover_image_link = cover_image_link;
    this.author_id = author_id;
  }

  static async getComments(id) {
    const query = "SELECT * FROM ArticleComment WHERE article_id = ?";
    const [rows] = await db.query(query, [id]);
    return rows;
  }

  static async postComment(articleId, userId, comment) {
    const query = "INSERT INTO ArticleComment (article_id, author_id, content) VALUES (?, ?, ?)";
    const [rows] = await db.query(query, [articleId, userId, comment]);
    return rows;
  }
}

module.exports = Article;

