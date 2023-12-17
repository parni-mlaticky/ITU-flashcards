const ORMBase = require('./ORMBase');
const db = require("../database");

class FulltextAnswer extends ORMBase {
  static table_name ="FulltextAnswer";

  constructor({ id, question_id, user_id, answer }) {
    super(id);
    this.table_name = "FulltextAnswer";
    this.question_id = question_id;
    this.user_id = user_id;
    this.answer = answer;
  }

  static async getByTestIdAndUserId(test_id, user_id) {
    const query = `SELECT *, a.answer AS answer FROM ${this.table_name} a JOIN FulltextQuestion q ON q.id = a.question_id WHERE q.test_id = ? AND user_id = ?`
    const [rows] = await db.query(query, [test_id, user_id]);
    const answers = rows.map(row => new this(row));
    return answers;
  }
}

module.exports = FulltextAnswer;
