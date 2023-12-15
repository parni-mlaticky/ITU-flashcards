const ORMBase = require("./ORMBase");

class GroupMessage extends ORMBase {
  table_name ="GroupMessage";

  constructor({ id, group_id, user_id, text}) {
    super(id);
    this.table_name = "GroupMessage";
    this.group_id = group_id;
    this.user_id = user_id;
    this.text = text;
  }

  static async getAllByGroupId(group_id) {
    const query = `SELECT * FROM ${this.name} WHERE group_id = ?`;
    const [rows] = await db.query(query, group_id);
    return rows.map(row => new this(row));
  }
}

module.exports = GroupMessage;
