const ORMBase = require("./ORMBase");

class LearningGroupMember extends ORMBase {
  table_name ="LearningGroupMember";

  constructor({ id, group_id, user_id }) {
    super(id);
    this.table_name = "LearningGroupMember";
    this.group_id = group_id;
    this.user_id = user_id;
  }

  static async getMembersByGroupId(group_id) {
    const query = `SELECT * FROM ${this.name} WHERE group_id = ?`;
    const [rows] = await db.query(query, group_id);
    return rows.map(row => new this(row));
  }
}

module.exports = LearningGroupMember;
