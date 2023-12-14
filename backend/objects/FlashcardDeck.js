const ORMBase = require('./ORMBase');

class FlashcardDeck extends ORMBase {
  constructor(id, author_id, name, description) {
    super(id);
    this.author_id = author_id;
    this.name = name;
    this.description = description;
  }
}

module.exports = FlashcardDeck;
