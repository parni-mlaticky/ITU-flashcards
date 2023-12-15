const ORMBase = require("./ORMBase");

class Choice extends ORMBase {
  constructor({ id, question_id, content }) {
    super(id);
    this.question_id = question_id;
    this.content = content;
  }

  get name() { return "Choice"; }
}


module.exports = Choice;

