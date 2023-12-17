const ORMBase = require("./ORMBase");
const db = require("../database");

class FlashcardDeck extends ORMBase {
  static table_name = "FlashcardDeck";

  constructor({ id, author_id, name, description, is_shared }) {
    super(id);
    this.table_name = "FlashcardDeck";
    this.author_id = author_id;
    this.name = name;
    this.description = description;
    this.is_shared = is_shared;
  }

  static async getAllByAuthor(author_id) {
    const query = `SELECT * FROM FlashcardDeck WHERE author_id = ?`;
    const [rows] = await db.query(query, author_id);
    const objects = rows.map((entry) => new this(entry));
    return objects;
  }

  static async getAllShared(user_id) {
    const query = `SELECT * FROM FlashcardDeck WHERE is_shared = true AND author_id != ?`;
    const [rows] = await db.query(query, user_id);
    const objects = rows.map((entry) => new this(entry));
    return objects;
  }
}

module.exports = FlashcardDeck;
