const ORMBase = require('./ORMBase');
const db = require("../database");

class FulltextQuestion extends ORMBase {
  static table_name ="FulltextQuestion";

  constructor({ id, test_id, question, answer, ranking }) {
    super(id);
    this.table_name = "FulltextQuestion";
    this.test_id = test_id;
    this.question = question;
    this.answer = answer;
    this.ranking = ranking;
  }

  static async getByTestId(test_id) {
    const query = `SELECT * FROM FulltextQuestion WHERE test_id = ?`;
    const [rows] = await db.query(query, [test_id]);
    const questions = rows.map(row => new this(row));
    return questions;
  }
}


module.exports = FulltextQuestion;
