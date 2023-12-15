const ORMBase = require("./ORMBase");

class Article extends ORMBase {
  static table_name ="Article";
  
  constructor({ id, heading, content, source_link, cover_image_link }) {
    super(id);
    this.table_name = "Article";
    this.heading = heading;
    this.content = content;
    this.source_link = source_link;
    this.cover_image_link = cover_image_link;
  }
}

module.exports = Article;

