delete from Users;
delete from Products;
drop table Users;
drop table Products;

CREATE TABLE Users (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  password text NOT NULL,
  access_key character(45),
  secret_key character(80)
);

CREATE TABLE Products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  words text NOT NULL
);


insert into Users(email, password, access_key, secret_key) values ('doop@doop.com', crypt('password', gen_salt('bf', 8)),
'4313396EE85C7E8466883FE4A39BEDC0F0EE1C44BA123',
'1847AB149BB3BDE88F33865DDF5BAEE6C2A0B9261DD2D39D53B1931F03486EEA785783239913FADD');

insert into Products(words) values ('Boop');
insert into Products(words) values ('Doop');
insert into Products(words) values ('Snoop');