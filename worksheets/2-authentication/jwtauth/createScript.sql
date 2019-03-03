CREATE TABLE Users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  password text NOT NULL
);

CREATE TABLE Products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  words text NOT NULL
);

/*inserting in some data into tables*/
insert into Users(email, password) values ('lauren@google.com', crypt('password', gen_salt('bf', 8)));

insert into Products(words) values ('Book');
insert into Products(words) values ('DVD');
insert into Products(words) values ('Chair');

/*adding access key and secret key columns*/
ALTER TABLE users
ADD COLUMN access_key CHAR(160),
ADD COLUMN secret_key CHAR(320);