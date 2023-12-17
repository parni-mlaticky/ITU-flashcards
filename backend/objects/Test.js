const ORMBase = require("./ORMBase");
const db = require("../database");

class Test extends ORMBase {
  static table_name = "Test";

  constructor({ id, group_id, name, difficulty}) {
    super(id);
    this.table_name ="Test";
    this.group_id = group_id;
    this.name = name;
    this.difficulty = difficulty;
  }

  static async getAllByGroupId(group_id, user_id) {
    const query = `
      SELECT t.*, COUNT(DISTINCT q.id) AS questions, COUNT(DISTINCT CASE WHEN a.user_id = ? THEN a.id ELSE NULL END) AS answers
      FROM Test t
      LEFT JOIN FulltextQuestion q ON t.id = q.test_id
      LEFT JOIN FulltextAnswer a ON q.id = a.question_id
      WHERE t.group_id = ?
      GROUP BY t.id;
    `;
    const [rows] = await db.query(query, [user_id, group_id]);
    const tests = rows.map(row => {
      const temp = new this(row);
      // Adding addittional information
      temp.questions = row.questions;
      temp.answers = row.answers;
      return temp;
    });
    return tests;
  }

  static async getUsersWhoAnsweredByTestId(test_id) {
    const query = `
      SELECT DISTINCT u.username, u.id
      FROM RegisteredUser u
      JOIN FulltextAnswer a ON u.id = a.user_id
      JOIN FulltextQuestion q ON a.question_id = q.id
      JOIN Test t ON q.test_id = t.id
      WHERE t.id = ?;
    `;
    const [rows] = await db.query(query, [test_id]);
    return rows;
  }
}


module.exports = Test;
