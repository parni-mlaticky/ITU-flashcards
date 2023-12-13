const ORMBase = require('./ORMBase');

class Flashcard extends ORMBase {
  constructor(id, deck_id, front, back, image) {
    super(id);
    this.deck_id = deck_id;
    this.front = front;
    this.back = back;
    this.image = image;
  }
}

module.exports = Flashcard;
