const db = require("../database");

class ORMBase {
  constructor(id) {
    this.id = id;
  }

  static init_from_id(id) {
    return new this(id);
  }

  get_column_names() {
    const column_names = [];
    for(const [key, value] of Object.entries(this)) {
      if(key != "id" && typeof value != "function") { column_names.push(key); }
    }
    return column_names.join(", ");
  }

  get_column_values() {
    const column_values = [];
    for(const [key, value] of Object.entries(this)) {
      if(key != "id" && typeof value != "function") { column_values.push(value); }
    }
    return column_values;
  }

  get_column_pairs() {
    const column_pairs = [];
    for (const [key, value] of Object.entries(this)) {
      if (key !== "id" && typeof value !== "function") {
        column_pairs.push(`${key} = ?`);
      }
    }
    return column_pairs.join(", ");
  }

  get_question_marks() {
    const question_marks = [];
    for(const [key, value] of Object.entries(this)) {
      if(key != "id" && typeof value != "function") { question_marks.push("?"); }
    }
    return question_marks.join(", ");
  }

  async save() {
    if(this.id == null) { await this.insert(); }
    else { await this.update(); }
    return this;
  }

  async insert() {
    const query = `INSERT INTO ${this.constructor.name} ( ${this.get_column_names()} ) VALUES ( ${this.get_question_marks()} )`;
    const [rows] = await db.query(query, this.get_column_values());
    this.id = rows.insertId;
  }

  async update () {
    const query = `UPDATE ${this.constructor.name} SET ${this.get_column_pairs()} WHERE id = ?`;  
    await db.query(query, this.get_column_values().concat(this.id));
  }

  async delete() {
    const query = `DELETE FROM ${this.constructor.name} WHERE id = ?`;
    await db.query(query, [this.id]);
  }

  static async getById(id) {
    const query = `SELECT * FROM ${this.constructor.name} WHERE id = ?`;
    const [rows] = await db.query(query, [id]);

    if (rows.length === 0) {
        return null;
    }

    const row = rows[0];
    const instance = new this(row);

    return instance;
  }


  // Carefull not all tables have name!
  static async getByName(name) {
    const query = `SELECT * FROM ${this.constructor.name} WHERE name = ?`;
    const [rows] = await db.query(query, [name]);

    if (rows.length === 0) {
        return null;
    }

    const row = rows[0];
    const instance = new this(row);

    return instance;
  }

  static async getAll() {
    const query = `SELECT * FROM ${this.constructor.name}`;
    const [rows] = await db.query(query);
    const objects = rows.map((entry) => new this(entry));
    return objects;
  }
}

module.exports = ORMBase;
