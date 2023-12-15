const ORMBase = require("./ORMBase");

class Test extends ORMBase {
  constructor({ id, group_id, name, difficulty }) {
    super(id);
    this.group_id = group_id;
    this.name = name;
    this.difficulty = difficulty;
  }

  static async getAllByGroupId(group_id) {
    const query = `SELECT * FROM ${this.name} WHERE group_id = ?`;
    const [rows] = await db.query(query, group_id);
    return rows.map(row => new this(row));
  }
  get name() { return "Test"; }
}


module.exports = Test;
