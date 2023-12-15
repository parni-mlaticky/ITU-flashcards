const ORMBase = require("./ORMBase");

class MultipleChoiceAnswer extends ORMBase {
  table_name ="MultipleChoiceAnswer";

  constructor({ id, question_id, user_id, choice_id }) {
    super(id);
    this.table_name ="MultipleChoiceAnswer";
    this.question_id = question_id;
    this.user_id = user_id;
    this.choice_id = choice_id
  }
}

module.exports = MultipleChoiceAnswer;
