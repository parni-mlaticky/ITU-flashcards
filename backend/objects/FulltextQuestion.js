const ORMBase = require('./ORMBase');

class FulltextQuestion extends ORMBase {
  constructor({ id, test_id, question, answer }) {
    super(id);
    this.test_id = test_id;
    this.question = question;
    this.answer = answer;
  }
  get table_name() { return "FulltextQuestion"; }
}


module.exports = FulltextQuestion;
