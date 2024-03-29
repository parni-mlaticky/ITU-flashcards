const ORMBase = require("./ORMBase");

class MultipleChoiceAnswer extends ORMBase {
  static table_name ="MultipleChoiceAnswer";

  constructor({ id, question_id, user_id, choice_id, index }) {
    super(id);
    this.table_name ="MultipleChoiceAnswer";
    this.question_id = question_id;
    this.user_id = user_id;
    this.choice_id = choice_id;
    this.index = index;
  }
}

module.exports = MultipleChoiceAnswer;
