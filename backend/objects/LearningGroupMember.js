const ORMBase = require("./ORMBase");

class LearningGroupMember extends ORMBase {
  constructor({ id, group_id, user_id }) {
    super(id);
    this.group_id = group_id;
    this.user_id = user_id;
  }
}


module.exports = LearningGroupMember;
