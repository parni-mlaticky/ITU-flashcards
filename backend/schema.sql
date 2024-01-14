create table RegisteredUser (
  id integer primary key auto_increment auto_increment,
  username varchar(255), 
  password varchar(255)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

create table Article (
  id integer primary key auto_increment auto_increment,
  heading varchar(255),
  content text,
  source_link varchar(255),
  cover_image_link varchar(255),
  author_id integer
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table Article add constraint fk_article_author_id foreign key (author_id) references RegisteredUser(id) on delete cascade;

create table CustomTranslation (
  id integer primary key auto_increment,
  author_id integer,
  article_id integer,
  start_char_index integer,
  end_char_index integer,
  content text
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table CustomTranslation add constraint fk_translation_article_id foreign key (article_id) references Article(id) on delete cascade; 
alter table CustomTranslation add constraint fk_translation_author_id foreign key (author_id) references RegisteredUser(id) on delete cascade;

create table DifficultyRating (
  id integer primary key auto_increment,
  article_id integer,
  user_id integer,
  rating integer
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table DifficultyRating add constraint fk_difficulty_article_id foreign key (article_id) references Article(id) on delete cascade;
alter table DifficultyRating add constraint fk_difficulty_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;

create table TranslationRating (
  id integer primary key auto_increment,
  translation_id integer,
  user_id integer,
  rating integer
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table TranslationRating add constraint fk_translation_rating_translation_id foreign key (translation_id) references CustomTranslation(id) on delete cascade;
alter table TranslationRating add constraint fk_translation_rating_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;

create table FlashcardDeck (
  id integer primary key auto_increment,
  author_id integer,
  name varchar(255),
  description text,
  is_shared boolean
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table FlashcardDeck add constraint fk_deck_author_id foreign key (author_id) references RegisteredUser(id) on delete cascade;

create table Flashcard (
  id integer primary key auto_increment,
  deck_id integer,
  front text,
  back text,
  image varchar(255)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table Flashcard add constraint fk_card_deck_id foreign key (deck_id) references FlashcardDeck(id) on delete cascade;

create table LearningGroup (
  id integer primary key auto_increment,
  name varchar(255),
  description text,
  lector_id integer
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table LearningGroup add constraint fk_group_lector_id foreign key (lector_id) references RegisteredUser(id) on delete cascade;

create table LearningGroupMember (
  id integer primary key auto_increment,
  group_id integer,
  user_id integer
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table LearningGroupMember add constraint fk_group_member_group_id foreign key (group_id) references LearningGroup(id) on delete cascade;
alter table LearningGroupMember add constraint fk_group_member_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;


create table Test (
  id integer primary key auto_increment,
  group_id integer,
  name varchar(255),
  difficulty integer
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table Test add constraint fk_test_group_id foreign key (group_id) references LearningGroup(id) on delete cascade;

create table FulltextQuestion (
  id integer primary key auto_increment,
  test_id integer,
  question text,
  answer text,
  ranking integer
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table FulltextQuestion add constraint fk_ftquestion_test_id foreign key (test_id) references Test(id) on delete cascade;

create table FulltextAnswer (
  id integer primary key auto_increment,
  question_id integer,
  user_id integer,
  answer text
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table FulltextAnswer add constraint fk_ftanswer_question_id foreign key (question_id) references FulltextQuestion(id) on delete cascade;
alter table FulltextAnswer add constraint fk_ftanswer_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;

create table Choice (
  id integer primary key auto_increment,
  question_id integer,
  content text
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

create table MultipleChoiceQuestion (
  id integer primary key auto_increment,
  test_id integer,
  question text,
  answer integer
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table MultipleChoiceQuestion add constraint fk_mcquestion_test_id foreign key (test_id) references Test(id) on delete cascade;

create table MultipleChoiceAnswer (
  id integer primary key auto_increment,
  question_id integer,
  user_id integer,
  choice_id integer
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table MultipleChoiceAnswer add constraint fk_mcanswer_question_id foreign key (question_id) references MultipleChoiceQuestion(id) on delete cascade;
alter table MultipleChoiceAnswer add constraint fk_mcanswer_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;
alter table MultipleChoiceAnswer add constraint fk_mcanswer_choice_id foreign key (choice_id) references Choice(id) on delete cascade;


create table GroupMessage (
  id integer primary key auto_increment,
  group_id integer,
  user_id integer,
  content text
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table GroupMessage add constraint fk_group_message_group_id foreign key (group_id) references LearningGroup(id) on delete cascade;
alter table GroupMessage add constraint fk_group_message_user_id foreign key (user_id) references RegisteredUser(id) on delete cascade;

create table ArticleComment (
  id integer primary key auto_increment,
  article_id integer,
  author_id integer,
  content text,
  timestamp timestamp default current_timestamp
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

alter table ArticleComment add constraint fk_article_comment_article_id foreign key (article_id) references Article(id) on delete cascade;
alter table ArticleComment add constraint fk_article_comment_user_id foreign key (author_id) references RegisteredUser(id) on delete cascade;

insert into Article (heading, content, source_link, cover_image_link) values ('Zmizely miliardy i exmanažer Wirecardu. Podezírají ho ze špionáže pro Rusko', 'Jeden z nejhledanějších lidí na seznamu Interpolu, nyní třiačtyřicetiletý Marsalek, je už déle obviněný z krádeže stovek milionů dolarů od investorů. Podle nových informací však už jako manažer Wirecard i později jako hledaný zločinec finančně podporoval ruské špionážní aktivity a fungoval jako prostředník mezi ruskou zahraniční rozvědkou SVR, vojenskou rozvědkou GRU a sítí agentů v evropských zemích.', 'https://www.idnes.cz/zpravy/zahranicni/rusko-nemecko-rakousko-manazer-jan-marsalek-cech-podvod-spionaz-agent.A231215_140726_zahranicni_dtt' , 'https://1gr.cz/fotky/idnes/23/122/cl8h/DTT78e0b6b825_profimedia_0789992328.jpg');
insert into Article (heading, content, source_link, cover_image_link) values ('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consequat ut sem vitae aliquam.', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam consequat ut sem vitae aliquam. Nam nec urna sed massa efficitur vestibulum ut at augue. Aenean ullamcorper odio a suscipit tempor. Aenean id libero massa. Sed a tortor eleifend, tincidunt libero vestibulum, euismod tortor. Proin eget blandit tortor. Suspendisse commodo euismod dolor at volutpat. Suspendisse luctus leo ac nisl facilisis, eu imperdiet magna tincidunt. Nunc facilisis tempor quam ac pulvinar. Aenean convallis, dui sodales fermentum mattis, risus risus maximus dui, non dictum risus nibh sed orci. Sed accumsan lacus quis tincidunt facilisis. Phasellus rutrum metus nec tellus euismod bibendum iaculis vitae massa. Donec dapibus arcu ut metus commodo, nec ullamcorper ex volutpat. Proin consequat sem sodales magna congue aliquet. Aliquam fermentum accumsan rhoncus.

Etiam imperdiet auctor nisl, quis ultricies leo vehicula eget. Phasellus facilisis vitae orci quis tempor. Donec consequat turpis turpis, a fermentum lorem posuere sed. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer dignissim dictum arcu eu scelerisque. Sed sit amet pulvinar arcu. Nullam elit ligula, feugiat at pharetra id, convallis dictum dolor.

Sed interdum lacus a nibh rutrum, at mattis turpis feugiat. Etiam gravida est mi, sed elementum odio porttitor eget. Ut porttitor vulputate lobortis. Morbi scelerisque placerat odio in semper. Praesent cursus sem a ipsum ultricies convallis. In finibus interdum mattis. Cras bibendum pharetra dui, vel cursus sapien imperdiet sit amet. Donec sodales lobortis quam sit amet posuere. Aenean dictum mi sapien.

Ut vel nisi at lectus tristique aliquet a sit amet ipsum. Nam vel pulvinar nisl. Morbi elementum risus vitae pulvinar convallis. Mauris urna erat, vulputate quis lectus eu, semper pellentesque mi. Cras iaculis luctus magna ac accumsan. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum varius, enim sed hendrerit pulvinar, enim dolor laoreet tortor, ut tincidunt ipsum ligula vitae magna. Pellentesque a porttitor arcu. Mauris ac risus at augue sollicitudin rutrum non sed est. Integer id leo id dui interdum lobortis. Morbi sollicitudin purus quis justo interdum, maximus vehicula urna aliquet. Curabitur pulvinar neque arcu, vitae iaculis augue sollicitudin at.

Quisque egestas lectus sit amet placerat luctus. Donec et interdum est. Cras mattis accumsan sapien sed condimentum. Ut vulputate sed nunc at mollis. Curabitur tincidunt aliquet dui suscipit porta. Aliquam ipsum tellus, dictum nec lorem sit amet, pulvinar lacinia ante. Nullam vitae lacinia justo. Suspendisse aliquam sollicitudin sapien, tempor fringilla leo condimentum id. Donec posuere condimentum tristique. Duis quam urna, molestie ornare imperdiet eget, ultricies sed lectus. Aenean nisi magna, placerat a est quis, lobortis consectetur mauris. Suspendisse sagittis tempus turpis, a consectetur tortor dictum tristique. Mauris blandit dolor at neque dictum, ac consectetur orci cursus.', 'https://google.com' , 'https://ih1.redbubble.net/image.3842182251.8950/raf,360x360,075,t,fafafa:ca443f4786.jpg'
);

insert into Article(heading, content, source_link, cover_image_link) values ('Papež František se připravuje na smrt. Vybral si hrob na nezvyklém místě', 
'Papež František prohlásil, že chce být pohřben v římské bazilice Panny Marie Sněžné, a ne v kryptách Svatopetrského dómu jako ostatní papežové. Hrob si již nechal připravit, a svoje rozhodnutí zdůvodnil tak, že chce i po smrti zůstat nablízku Madoně.
 S papežským ceremoniářem také pracuje na zjednodušení obřadních pravidel. Papež, který v neděli slaví 87. narozeniny, uvedl, že s papežským ceremoniářem pracuje na zjednodušení velice podrobných obřadních pravidel, která byla uplatněna u pohřbů jeho předchůdců. Řekl také, že chce být pohřben v římské bazilice Panny Marie Sněžné (Santa Maria Maggiore), která má exteritoriální status a patří Vatikánu. Papež se sem pravidelně chodívá modlit.
„Je to moje velká oddanost,“ řekl František a dodal, že už se rozhodl, že chce být pohřben poblíž baziliky. „Místo je již připraveno,“ řekl novinářům.',
'https://www.idnes.cz/zpravy/zahranicni/frantisek-chce-zjednodusit-papezske-pohrby-pochovan-ma-byt-mimo-vatikan.A231213_104403_zahranicni_pitt',
'https://1gr.cz/fotky/idnes/23/122/cl5/PIT6a20732f37_profimedia_0828065930.jpg');

insert into Article(heading, content, source_link, cover_image_link) values (
'Nutella vs. máslo. Lidi už hádky unavují, říká po debatě Fialy a Babiše politolog', 
'Nedělní televizní debata mezi premiérem Petrem Fialou (ODS) a opozičním lídrem Andreje Babišem (ANO)
 přinesla hádku o cenách másla a rohlíku nebo obviňování z okrádání babiček. „V debatě byl o něco více vidět Babiš,“ říká
  v rozhovoru pro iDNES.cz Milan Školník, politolog z Katedry humanitních věd Provozně ekonomické fakulty České zemědělské univerzity v Praze.
„Myslím, že lidé si dovedou udělat obrázek sami,“ řekl po nedělní televizní debatě s Andrejem Babišem premiér Petr Fiala. 
„Pan premiér žije v jiné galaxii, jsou to samé lži, co tady vykládal,“ osočil ho následně Babiš. Podle politologa už mohou 
být lidé z takových hádek unaveni, což by se mohlo projevit také ve volební účasti. „Může stagnovat nebo slábnout,“ myslí si politolog.',
'https://www.idnes.cz/zpravy/domaci/debata-fiala-babis-politolog-milan-skolnik-rozhovor.A231217_133709_domaci_nema',
'https://cdn.xsd.cz/resize/108426a9b5c838519bd861f00192e58e_extract=54,0,640,360_resize=680,383_.jpg?hash=0adcb75ff14852ce14e19a995427d023');

insert into Article(heading, content, source_link, cover_image_link) values (
'Útok na IT stojí pět dolarů, výzvou bude hokej, říká technologický šéf Microsoftu', 
'Než čtenář dočte tuto větu, na světě dojde k sedmi tisícům pokusů o krádež hesla. Tak začal Dalibor Káčmář, 
technologický ředitel Microsoft, rozhovor pro portál iDNES.cz. Microsoft nedávno vydal roční zprávu o kyberbezpečnosti.
 Na pozoru před hackerskými útoky mají být i organizátoři velkých akcí, jako je hokejové mistrovství světa, které se v Česku bude hrát v květnu.
 V příštím roce čeká Čechy domácí mistrovství světa v hokeji. Mluvíte v této souvislosti o hackerských hrozbách. Jak se dá hacknout hokejové mistrovství?
Pro sportovního fanouška nemusí být zcela zřejmé, jak velké množství technologií je potřeba pro organizaci velkých sportovních událostí. Tak, jak nás provází technologie v jiných oborech, ani sport není pozadu. Navíc velké sportovní události jsou i velkou obchodní událostí.

Počítače, koncová zařízení, IoT technologie, přenosová a vysílací technika, bezpečnostní systémy, ale i sociální sítě, prodejní portály, fanouškovské zóny. To jsou všechna místa, která mohou být efektivně narušena a způsobit vážné problémy.

Kdo by tedy mohl na na hokejové mistrovství zaútočit?
Aktérů, kteří mohou mít zájem poškodit nebo využít takovou událost, je mnoho. Od těch, kteří útočí z ryze ekonomického důvodu se snahou získat výkupné či zpeněžit zcizená data, až po hacktivisty a národními státy sponzorované aktéry, kteří mají za cíl narušit organizaci události nebo vyvolat zmatek.
 ',
'https://www.idnes.cz/zpravy/domaci/rozhovor-microsoft-dalibor-kacmar-it-technologie-kyberbezpecnost-ai-hrozby.A231206_210932_domaci_nema',
'https://1gr.cz/fotky/idnes/23/121/cl5/NEMb224f0ae39__K_13870.jpg');

insert into Article(heading, content, source_link, cover_image_link) values (
'Zkrat a nepochopitelné oplácení. Tanko se potrestal sám, řekl Buchta o červené', 
'Zpravidla je to on, kdo ostravskému Baníku svými góly přináší cenné body, tentokrát předvedl pravý opak. 
S míčem se Abdullahi Tanko blížil k postranní čáře, když ho zezadu strčil slávistický bek David Douděra, 
načež rozhodčí pískl faul. Jen co se domácí fotbalista zvedl z přilehlé atletické dráhy, rozběhl se vstříc soupeři a hrudí ho poslal k zemi.
 Vysloužil si červenou kartu.',
'https://www.idnes.cz/fotbal/prvni-liga/fortuna-liga-banik-ostrava-slavia-abdullahi-tanko-david-doudera-cervena.A231217_180306_fotbal_duff',
'https://1884403144.rsc.cdn77.org/foto/sport-fotbal-kinsky-pardubice/Zml0LWluLzEwNTB4OTk5OS9maWx0ZXJzOnF1YWxpdHkoODUpOm5vX3Vwc2NhbGUoKTpmb2NhbCgzODd4Njg6NzIxeDIzNykvaW1n/8804717.jpg?v=0&st=GmNCWo5P2gSx7TGq-x2wOFkGaIXtQ5Ssaq1baZoHBAQ&ts=1600812000&e=0');


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

ALTER TABLE ArticleComment DROP FOREIGN KEY fk_article_comment_article_id;
ALTER TABLE ArticleComment DROP FOREIGN KEY fk_article_comment_user_id;

ALTER TABLE Article DROP FOREIGN KEY fk_article_author_id;

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
drop table if exists ArticleComment;
