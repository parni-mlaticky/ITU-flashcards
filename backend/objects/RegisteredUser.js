const db = require("../database");
const ORMBase = require("./ORMBase");

class RegisteredUser extends ORMBase {
  static table_name = "RegisteredUser"
  constructor({ id, username, password }) {
    super(id);
    this.table_name = "RegisteredUser";
    this.username = username;
    this.password = password;
  }

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

  static getUsername = async (id) => {
    const query = "SELECT username FROM RegisteredUser WHERE id = ?"
    const [rows] = await db.query(query, [id]);
    if (rows.length == 0) {
      return null;
    }
    return rows[0];
  }
}

module.exports = RegisteredUser;
