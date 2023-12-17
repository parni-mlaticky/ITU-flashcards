const ORMBase = require("./ORMBase");
const db = require("../database");

class GroupMessage extends ORMBase {
  static table_name ="GroupMessage";

  constructor({ id, group_id, user_id, content}) {
    super(id);
    this.table_name = "GroupMessage";
    this.group_id = group_id;
    this.user_id = user_id;
    this.content = content;
  }

  static async getAllByGroupId(group_id) {
    const query = `SELECT m.*, u.username FROM ${this.name} m JOIN RegisteredUser u ON m.user_id = u.id WHERE group_id = ? ORDER BY m.id`;
    const [rows] = await db.query(query, group_id);
    return rows.map(row => {
      const obj = new this(row)
      obj.username = row.username;
      return obj;
    });
  }
}

module.exports = GroupMessage;
