DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

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