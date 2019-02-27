--Make sure you run the comman CREATE EXTENSION pgcrypto; in the terminal before loading in this file
DROP TABLE IF EXISTS USERS;
DROP TABLE IF EXISTS PRODUCTS;

CREATE TABLE USERS(
    USERNAME VARCHAR(255) UNIQUE NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL
);

CREATE TABLE PRODUCTS(
    PRODUCT_ID INTEGER UNIQUE NOT NULL,
    PRODUCT_NAME VARCHAR(255) NOT NULL,
    PRODUCT_PRICE FLOAT NOT NULL
);

INSERT INTO USERS (USERNAME,PASSWORD)
VALUES ('Mitko10343',crypt('password',gen_salt('bf')));
INSERT INTO USERS (USERNAME,PASSWORD)
VALUES ('Admin',crypt('password',gen_salt('bf')));
INSERT INTO USERS (USERNAME,PASSWORD)
VALUES ('Test',crypt('password',gen_salt('bf')));


INSERT INTO PRODUCTS(PRODUCT_ID,PRODUCT_NAME,PRODUCT_PRICE)
VALUES (1,'Apple',0.40);
INSERT INTO PRODUCTS(PRODUCT_ID,PRODUCT_NAME,PRODUCT_PRICE)
VALUES (2,'Banana',0.40);
INSERT INTO PRODUCTS(PRODUCT_ID,PRODUCT_NAME,PRODUCT_PRICE)
VALUES (3,'Pear',0.40);