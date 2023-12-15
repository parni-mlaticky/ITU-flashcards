const ORMBase = require('./ORMBase');
const db = require('../database');

class FlashcardDeck extends ORMBase {
  constructor({ id, author_id, name, description }) {
    super(id);
    this.author_id = author_id;
    this.name = name;
    this.description = description;
  }

  static async getAllByAuthor(author_id) {
    const query = `SELECT * FROM FlashcardDeck WHERE author_id = ?`;
    const [rows] = await db.query(query, author_id);
    const objects = rows.map((entry) => new this(entry));
    return objects;
  }
  get name() { return "FlashcardDeck"; }
}

module.exports = FlashcardDeck;
