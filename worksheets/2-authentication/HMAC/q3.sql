drop table if exists products;
drop table if exists users;
drop extension pgcrypto;

CREATE EXTENSION pgcrypto;

CREATE TABLE USERS(
    userID SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,

    accessKey TEXT,
    secretKey TEXT

);

INSERT INTO USERS (username, password, accessKey, secretKey) 
VALUES ('admin', crypt('pass', gen_salt('bf', 8)), 'accesskey', 'secretkey' );

CREATE TABLE PRODUCTS(
    productID SERIAL PRIMARY KEY,
    productName VARCHAR(255) NOT NULL,
    productPrice DECIMAL(12,2) NOT NULL
);

INSERT INTO PRODUCTS (productName, productPrice) VALUES ('Product 1', 50.00);
INSERT INTO PRODUCTS (productName, productPrice) VALUES ('Product 2', 60.00);
