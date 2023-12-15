const ORMBase = require('./ORMBase');

class Flashcard extends ORMBase {
  constructor({ id, deck_id, front, back, image }) {
    super(id);
    this.deck_id = deck_id;
    this.front = front;
    this.back = back;
    this.image = image;
  }

  static async getAllInDeck(id) {
    const query = `SELECT * FROM FlashcardDeck d JOIN Flashcard c ON d.id = c.deck_id WHERE id = ?`;
    const [rows] = await db.query(query);
    const objects = rows.map((entry) => new this(entry));
    return objects;
  }
  get table_name() { return "Flashcard"; }
}

module.exports = Flashcard;
