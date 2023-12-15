const ORMBase = require("./ORMBase");

class Choice extends ORMBase {
  static table_name ="Choice";

  constructor({ id, question_id, content }) {
    super(id);
    this.table_name = "Choice";
    this.question_id = question_id;
    this.content = content;
  }
}


module.exports = Choice;

