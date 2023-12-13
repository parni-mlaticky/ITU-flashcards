const ORMBase = require("./ORMBase");

class CustomTranslation extends ORMBase {
  constructor(id, author_id, article_id, start_char_index, end_char_index, content) {
    super(id);
    this.author_id = author_id;
    this.article_id = article_id;
    this.start_char_index = start_char_index;
    this.end_char_index = end_char_index;
    this.content = content;
  }
}

module.exports = CustomTranslation;
