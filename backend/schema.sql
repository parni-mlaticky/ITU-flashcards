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
  description text,
  is_shared boolean
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


insert into Article (heading, content, source_link, cover_image_link) values ('Zmizely miliardy i exmanažer Wirecardu. Podezírají ho ze špionáže pro Rusko', 'Jeden z nejhledanějších lidí na seznamu Interpolu, nyní třiačtyřicetiletý Marsalek, je už déle obviněný z krádeže stovek milionů dolarů od investorů. Podle nových informací však už jako manažer Wirecard i později jako hledaný zločinec finančně podporoval ruské špionážní aktivity a fungoval jako prostředník mezi ruskou zahraniční rozvědkou SVR, vojenskou rozvědkou GRU a sítí agentů v evropských zemích.', 'https://www.idnes.cz/zpravy/zahranicni/rusko-nemecko-rakousko-manazer-jan-marsalek-cech-podvod-spionaz-agent.A231215_140726_zahranicni_dtt' , 'https://1gr.cz/fotky/idnes/23/122/cl8h/DTT78e0b6b825_profimedia_0789992328.jpg');
insert into Article (heading, content, source_link, cover_image_link) values ('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consequat ut sem vitae aliquam.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consequat ut sem vitae aliquam. Nam nec urna sed massa efficitur vestibulum ut at augue. Aenean ullamcorper odio a suscipit tempor. Aenean id libero massa. Sed a tortor eleifend, tincidunt libero vestibulum, euismod tortor. Proin eget blandit tortor. Suspendisse commodo euismod dolor at volutpat. Suspendisse luctus leo ac nisl facilisis, eu imperdiet magna tincidunt. Nunc facilisis tempor quam ac pulvinar. Aenean convallis, dui sodales fermentum mattis, risus risus maximus dui, non dictum risus nibh sed orci. Sed accumsan lacus quis tincidunt facilisis. Phasellus rutrum metus nec tellus euismod bibendum iaculis vitae massa. Donec dapibus arcu ut metus commodo, nec ullamcorper ex volutpat. Proin consequat sem sodales magna congue aliquet. Aliquam fermentum accumsan rhoncus.

Etiam imperdiet auctor nisl, quis ultricies leo vehicula eget. Phasellus facilisis vitae orci quis tempor. Donec consequat turpis turpis, a fermentum lorem posuere sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer dignissim dictum arcu eu scelerisque. Sed sit amet pulvinar arcu. Nullam elit ligula, feugiat at pharetra id, convallis dictum dolor.

Sed interdum lacus a nibh rutrum, at mattis turpis feugiat. Etiam gravida est mi, sed elementum odio porttitor eget. Ut porttitor vulputate lobortis. Morbi scelerisque placerat odio in semper. Praesent cursus sem a ipsum ultricies convallis. In finibus interdum mattis. Cras bibendum pharetra dui, vel cursus sapien imperdiet sit amet. Donec sodales lobortis quam sit amet posuere. Aenean dictum mi sapien.

Ut vel nisi at lectus tristique aliquet a sit amet ipsum. Nam vel pulvinar nisl. Morbi elementum risus vitae pulvinar convallis. Mauris urna erat, vulputate quis lectus eu, semper pellentesque mi. Cras iaculis luctus magna ac accumsan. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum varius, enim sed hendrerit pulvinar, enim dolor laoreet tortor, ut tincidunt ipsum ligula vitae magna. Pellentesque a porttitor arcu. Mauris ac risus at augue sollicitudin rutrum non sed est. Integer id leo id dui interdum lobortis. Morbi sollicitudin purus quis justo interdum, maximus vehicula urna aliquet. Curabitur pulvinar neque arcu, vitae iaculis augue sollicitudin at.

Quisque egestas lectus sit amet placerat luctus. Donec et interdum est. Cras mattis accumsan sapien sed condimentum. Ut vulputate sed nunc at mollis. Curabitur tincidunt aliquet dui suscipit porta. Aliquam ipsum tellus, dictum nec lorem sit amet, pulvinar lacinia ante. Nullam vitae lacinia justo. Suspendisse aliquam sollicitudin sapien, tempor fringilla leo condimentum id. Donec posuere condimentum tristique. Duis quam urna, molestie ornare imperdiet eget, ultricies sed lectus. Aenean nisi magna, placerat a est quis, lobortis consectetur mauris. Suspendisse sagittis tempus turpis, a consectetur tortor dictum tristique. Mauris blandit dolor at neque dictum, ac consectetur orci cursus.', 'https://google.com' , 'https://ih1.redbubble.net/image.3842182251.8950/raf,360x360,075,t,fafafa:ca443f4786.jpg');


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

