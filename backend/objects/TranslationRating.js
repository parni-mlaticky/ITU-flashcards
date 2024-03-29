const ORMBase = require("./ORMBase");

class TranslationRating extends ORMBase {
  static table_name ="TranslationRating";

  constructor({ id, translation_id, user_id, rating }) {
    super(id);
    this.table_name ="TranslationRating";
    this.translation_id = translation_id;
    this.user_id = user_id;
    this.rating = rating;
  }
}

module.exports = TranslationRating;
