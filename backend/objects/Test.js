const ORMBase = require("./ORMBase");

class Test extends ORMBase {
  constructor({ id, group_id, name, difficulty }) {
    super(id);
    this.group_id = group_id;
    this.name = name;
    this.difficulty = difficulty;
  }
}


module.exports = Test;
