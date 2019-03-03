drop table products;
drop table users;

/*
psql -U postgres postgres;
\i c:database.sql
SET search_path TO lab2;
*/

CREATE TABLE users (
    username TEXT,
    password TEXT
);

INSERT INTO users values ('Chloe_Doyle', crypt('password', gen_salt('md5')));
INSERT INTO users values ('Test2', crypt('password123', gen_salt('md5')));

create table products
  (
    ID SERIAL UNIQUE,
    prod_name TEXT,
    price FLOAT
  );
  

insert into products (prod_name, price) values ('Book1', 5.99);
insert into products(prod_name, price) values ('Book2', 7.99);
insert into products(prod_name, price) values('Book3', 3.99);
insert into products(prod_name, price)values ('Book4', 10.99);
insert into products(prod_name, price)values ('Book5', 11.99);
