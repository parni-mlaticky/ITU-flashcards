const ORMBase = require("./ORMBase");
const GroupMessage = require("./GroupMessage");
const LearningGroupMember = require("./LearningGroupMember");
const RegisteredUser = require("./RegisteredUser");
const Test = require("./Test");
const db = require("../database");

class LearningGroup extends ORMBase {
  static table_name ="LearningGroup";

  constructor({ id, name, description, lector_id }) {
    super(id);
    this.table_name = "LearningGroup";
    this.name = name;
    this.description = description;
    this.lector_id = lector_id;
  }

  async getChat() {
    return await GroupMessage.getAllByGroupId(this.id);
  }

  async getMembers() {
    return await LearningGroupMember.getMembersByGroupId(this.id);
  }

  async getLector() {
    return await RegisteredUser.getById(this.lector_id);
  }

  async getTests() {
    return await Test.getAllByGroupId(this.id);
  }

  async addUser(user_id) {
    const member = new LearningGroupMember({ group_id: this.id, user_id });
    await member.save();
  }

  async removeUser(user_id) {
    const member = await LearningGroupMember.getMembersByGroupIdAndUserId(this.id, user_id);
    await member.delete();
  }

  static async postMessage(group_id, user_id, text) {
    const message = new GroupMessage({ group_id, user_id, text });
    await message.save();
  }

  static async getGroupsByUserId(user_id) {
    const query = `SELECT *, l.id AS id FROM LearningGroupMember m RIGHT JOIN ${this.name} l ON m.group_id = l.id WHERE m.user_id = ? OR l.lector_id = ?`;
    const [rows] = await db.query(query, [user_id, user_id]);
    return rows.map(entry => new this(entry));
  }
}

module.exports = LearningGroup;
