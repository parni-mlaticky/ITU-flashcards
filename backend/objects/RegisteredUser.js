const db = require("../database");
const ORMBase = require("./ORMBase");

class RegisteredUser extends ORMBase {
  constructor({ id, username, password }) {
    super(id);
    this.username = username;
    this.password = password;
  }

  get name() { return "RegisteredUser"; }

  static getByUsername = async (username) => {
    const query = "SELECT * FROM RegisteredUser WHERE username = ?";
    const [rows] = await db.query(query, [username]);
    if (rows.length == 0) {
      return null;
    }
    const user = new RegisteredUser({
      id: rows[0].id,
      username: rows[0].username,
      password: rows[0].password,
    });
    return user;
  };
}

module.exports = RegisteredUser;
