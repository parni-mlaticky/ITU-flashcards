const ORMBase = require("./ORMBase");

class LearningGroup extends ORMBase {
  constructor({ id, name, description, lector_id }) {
    super(id);
    this.name = name;
    this.description = description;
    this.lector_id = lector_id;
  }
}


module.exports = LearningGroup;
