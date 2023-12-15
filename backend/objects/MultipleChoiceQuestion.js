const ORMBase = require("./ORMBase");

class MultipleChoiceQuestion extends ORMBase {
  table_name ="MultipleChoiceQuestion";

  constructor({ id, test_id, question, answer }) {
    super(id);
    this.test_id = test_id;
    this.question = question;
    this.answer = answer;
  }
}

module.exports = MultipleChoiceQuestion;
