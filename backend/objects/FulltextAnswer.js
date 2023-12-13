const ORMBase = require('./ORMBase');

class FulltextAnswer extends ORMBase {
  constructor(id, question_id, user_id, answer) {
    super(id);
    this.question_id = question_id;
    this.user_id = user_id;
    this.answer = answer;
  }
}

module.exports = FulltextAnswer;
