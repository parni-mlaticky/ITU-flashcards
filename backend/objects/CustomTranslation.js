const ORMBase = require("./ORMBase");

class CustomTranslation extends ORMBase {
  constructor({ id, author_id, article_id, start_char_index, end_char_index, content }) {
    super(id);
    this.author_id = author_id;
    this.article_id = article_id;
    this.start_char_index = start_char_index;
    this.end_char_index = end_char_index;
    this.content = content;
  }

  static async getByAuthorId(article_id, author_id) {
    const query = `SELECT * FROM CustomTranslation WHERE article_id = ? AND author_id = ?`;
    const [rows] = await db.query(query, [article_id, user_id]);

    if (rows.length === 0) {
        return null;
    }

    const row = rows[0];
    const instance = new CustomTranslation(row);

    return instance;
  }

 get table_name() { return "CustomTranslation"; }
}

module.exports = CustomTranslation;
