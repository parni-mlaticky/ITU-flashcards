const ORMBase = require("./ORMBase");
const GroupMessage = require("./GroupMessage");
const LearningGroupMember = require("./LearningGroupMember");
const RegisteredUser = require("./RegisteredUser");
const Test = require("./Test");

class LearningGroup extends ORMBase {
  table_name ="LearningGroup";

  constructor({ id, name, description, lector_id }) {
    super(id);
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
    const member = await LearningGroupMember.getByGroupIdAndUserId(this.id, user_id);
    await member.delete();
  }

  static async postMessage(group_id, user_id, text) {
    const message = new GroupMessage({ group_id, user_id, text });
    await message.save();
  }
}

module.exports = LearningGroup;
