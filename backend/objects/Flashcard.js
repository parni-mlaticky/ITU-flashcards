const ORMBase = require("./ORMBase");
const db = require("../database");

class Flashcard extends ORMBase {
  static table_name = "Flashcard";

  constructor({ id, deck_id, front, back, image }) {
    super(id);
    this.table_name = "Flashcard";
    this.deck_id = deck_id;
    this.front = front;
    this.back = back;
    this.image = image;
  }

  static async getAllInDeck(id) {
    const query = `SELECT * FROM FlashcardDeck d JOIN Flashcard c ON d.id = c.deck_id WHERE d.id = ?`;
    const [rows] = await db.query(query, [id]);
    const objects = rows.map((entry) => new this(entry));
    return objects;
  }
}

module.exports = Flashcard;
