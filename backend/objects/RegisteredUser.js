const db = require("../database");
const ORMBase = require("./ORMBase");

class RegisteredUser extends ORMBase {
  constructor({ id, username, password }) {
    super(id);
    this.username = username;
    this.password = password;
  }
  
  static get_by_username = async (username) => {
    const query = "SELECT * FROM RegisteredUser WHERE username = ?";
    const [rows] = await db.query(query, [username]);
    if(rows.length == 0) { return null; }
    return new RegisteredUser(rows[0].id, rows[0].username, rows[0].password);
  }
}


module.exports = RegisteredUser;
