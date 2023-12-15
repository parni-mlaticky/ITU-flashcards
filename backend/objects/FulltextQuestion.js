const ORMBase = require('./ORMBase');

class FulltextQuestion extends ORMBase {
  table_name ="FulltextQuestion";

  constructor({ id, test_id, question, answer }) {
    super(id);
    this.table_name = "FulltextQuestion";
    this.test_id = test_id;
    this.question = question;
    this.answer = answer;
  }
}


module.exports = FulltextQuestion;
