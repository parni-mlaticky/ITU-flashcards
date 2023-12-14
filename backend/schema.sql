create table RegisteredUser (
  id integer primary key auto_increment auto_increment,
  username varchar(255), 
  password varchar(255)
);

create table Article (
  id integer primary key auto_increment auto_increment,
  heading varchar(255),
  content text,
  source_link varchar(255),
  cover_image_link varchar(255)
);

create table CustomTranslation (
  id integer primary key auto_increment,
  author_id integer,
  article_id integer,
  start_char_index integer,
  end_char_index integer,
  content text
);

alter table CustomTranslation add constraint fk_translation_article_id foreign key (article_id) references Article(id) on delete cascade; 
alter table CustomTranslation add constraint fk_translation_author_id foreign key (author_id) references RegisteredUser(id) on delete cascade;

create table DifficultyRating (
  id integer primary key auto_increment,
  article_id integer,
  user_id integer,
  rating integer
);

alter table DifficultyRating add constraint fk_difficulty_article_id foreign key (article_id) references Article(id) on delete cascade;
alter table DifficultyRating add constraint fk_difficulty_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;

create table TranslationRating (
  id integer primary key auto_increment,
  translation_id integer,
  user_id integer,
  rating integer
);

alter table TranslationRating add constraint fk_translation_rating_translation_id foreign key (translation_id) references CustomTranslation(id) on delete cascade;
alter table TranslationRating add constraint fk_translation_rating_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;

create table FlashcardDeck (
  id integer primary key auto_increment,
  author_id integer,
  name varchar(255),
  description text
);

alter table FlashcardDeck add constraint fk_deck_author_id foreign key (author_id) references RegisteredUser(id) on delete cascade;

create table Flashcard (
  id integer primary key auto_increment,
  deck_id integer,
  front text,
  back text,
  image varchar(255)
);

alter table Flashcard add constraint fk_card_deck_id foreign key (deck_id) references FlashcardDeck(id) on delete cascade;

create table LearningGroup (
  id integer primary key auto_increment,
  name varchar(255),
  description text,
  lector_id integer
);

alter table LearningGroup add constraint fk_group_lector_id foreign key (lector_id) references RegisteredUser(id) on delete cascade;

create table LearningGroupMember (
  id integer primary key auto_increment,
  group_id integer,
  user_id integer
);

alter table LearningGroupMember add constraint fk_group_member_group_id foreign key (group_id) references LearningGroup(id) on delete cascade;
alter table LearningGroupMember add constraint fk_group_member_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;


create table Test (
  id integer primary key auto_increment,
  group_id integer,
  name varchar(255),
  difficulty integer
);

alter table Test add constraint fk_test_group_id foreign key (group_id) references LearningGroup(id) on delete cascade;

create table FulltextQuestion (
  id integer primary key auto_increment,
  test_id integer,
  question text,
  answer text
);

alter table FulltextQuestion add constraint fk_ftquestion_test_id foreign key (test_id) references Test(id) on delete cascade;

create table FulltextAnswer (
  id integer primary key auto_increment,
  question_id integer,
  user_id integer,
  answer text
);

alter table FulltextAnswer add constraint fk_ftanswer_question_id foreign key (question_id) references FulltextQuestion(id) on delete cascade;
alter table FulltextAnswer add constraint fk_ftanswer_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;

create table Choice (
  id integer primary key auto_increment,
  question_id integer,
  content text
);


create table MultipleChoiceQuestion (
  id integer primary key auto_increment,
  test_id integer,
  question text,
  answer integer
);

alter table MultipleChoiceQuestion add constraint fk_mcquestion_test_id foreign key (test_id) references Test(id) on delete cascade;

create table MultipleChoiceAnswer (
  id integer primary key auto_increment,
  question_id integer,
  user_id integer,
  choice_id integer
);

alter table MultipleChoiceAnswer add constraint fk_mcanswer_question_id foreign key (question_id) references MultipleChoiceQuestion(id) on delete cascade;
alter table MultipleChoiceAnswer add constraint fk_mcanswer_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;
alter table MultipleChoiceAnswer add constraint fk_mcanswer_choice_id foreign key (choice_id) references Choice(id) on delete cascade;


create table GroupMessage (
  id integer primary key auto_increment,
  group_id integer,
  user_id integer,
  content text
);

alter table GroupMessage add constraint fk_group_message_group_id foreign key (group_id) references LearningGroup(id) on delete cascade;
alter table GroupMessage add constraint fk_group_message_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;



-- DELETING
ALTER TABLE CustomTranslation DROP FOREIGN KEY fk_translation_article_id;
ALTER TABLE CustomTranslation DROP FOREIGN KEY fk_translation_author_id;

ALTER TABLE DifficultyRating DROP FOREIGN KEY fk_difficulty_article_id;
ALTER TABLE DifficultyRating DROP FOREIGN KEY fk_difficulty_user_id;

ALTER TABLE TranslationRating DROP FOREIGN KEY fk_translation_rating_translation_id;
ALTER TABLE TranslationRating DROP FOREIGN KEY fk_translation_rating_user_id;

ALTER TABLE FlashcardDeck DROP FOREIGN KEY fk_deck_author_id;

ALTER TABLE Flashcard DROP FOREIGN KEY fk_card_deck_id;

ALTER TABLE LearningGroup DROP FOREIGN KEY fk_group_lector_id;

ALTER TABLE LearningGroupMember DROP FOREIGN KEY fk_group_member_group_id;
ALTER TABLE LearningGroupMember DROP FOREIGN KEY fk_group_member_user_id;

ALTER TABLE Test DROP FOREIGN KEY fk_test_group_id;

ALTER TABLE FulltextQuestion DROP FOREIGN KEY fk_ftquestion_test_id;

ALTER TABLE FulltextAnswer DROP FOREIGN KEY fk_ftanswer_question_id;
ALTER TABLE FulltextAnswer DROP FOREIGN KEY fk_ftanswer_user_id;

ALTER TABLE MultipleChoiceQuestion DROP FOREIGN KEY fk_mcquestion_test_id;

ALTER TABLE MultipleChoiceAnswer DROP FOREIGN KEY fk_mcanswer_question_id;
ALTER TABLE MultipleChoiceAnswer DROP FOREIGN KEY fk_mcanswer_user_id;
ALTER TABLE MultipleChoiceAnswer DROP FOREIGN KEY fk_mcanswer_choice_id;

ALTER TABLE GroupMessage DROP FOREIGN KEY fk_group_message_group_id;
ALTER TABLE GroupMessage DROP FOREIGN KEY fk_group_message_user_id;

drop table if exists RegisteredUser;
drop table if exists Article;
drop table if exists CustomTranslation;
drop table if exists DifficultyRating;
drop table if exists TranslationRating;
drop table if exists FlashcardDeck;
drop table if exists Flashcard;
drop table if exists LearningGroup;
drop table if exists LearningGroupMember;
drop table if exists Test;
drop table if exists FulltextQuestion;
drop table if exists FulltextAnswer;
drop table if exists Choice;
drop table if exists MultipleChoiceAnswer;
drop table if exists MultipleChoiceQuestion;
drop table if exists GroupMessage;

