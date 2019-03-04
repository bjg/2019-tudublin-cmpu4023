DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users_extended;

CREATE TABLE users(
    username varchar(250) NOT NULL,
    password varchar(250) NOT NULL
);

CREATE TABLE products(
    productid int NOT NULL,
    productname varchar(30),
    unitprice int,
    unitstock int
);

CREATE TABLE users_extended(
    username varchar(250) NOT NULL,
    password varchar(250) NOT NULL,
    access_key BYTEA, 
    secret_key BYTEA
);

INSERT INTO users(username,password) 
VALUES ('Rjak', crypt('p1zza',gen_salt('bf')));
INSERT INTO users(username,password) 
VALUES ('Tailor', crypt('swifty',gen_salt('bf')));
INSERT INTO users(username,password) 
VALUES ('Viv', crypt('p@ssTheB@ll',gen_salt('bf')));
INSERT INTO users(username,password) 
VALUES ('Arry', crypt('P0tter',gen_salt('bf')));
INSERT INTO users(username,password) 
VALUES ('Enewman', crypt('butterso',gen_salt('bf')));

INSERT INTO products(productid,productname, unitprice, unitstock) 
                    VALUES
                    (1, 'Football', 15, 99),
                    (2, 'Bicycle', 123, 2),
                    (3, 'Laptop', 986, 26),
                    (4, 'Mouse', 13, 4),
                    (5, 'Bottle', 100, 3);

INSERT INTO users_extended(username, password, access_key, secret_key)
VALUES ('Tom', crypt('H3llo',gen_salt('bf')), '63270a5d4770a09a139bcc4b120ccf60e1cc8826','5812483e092c28e4d55e903deee1ecd420c7de75905e9699344cebb075ac530abe991d6f8605443ace5e26d64c');