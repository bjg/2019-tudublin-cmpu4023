-- Name: Robert Vaughan
-- StudentNo: C15341261

-- Run to use pgcrypto functions
CREATE EXTENSION pgcrypto;

DROP TABLE PRODUCTS;
DROP TABLE USERS;

-- Creates the users table for part 1 and 3
CREATE TABLE USERS(
	user_id SERIAL PRIMARY KEY,
	username VARCHAR NOT NULL,
	password VARCHAR NOT NULL,

	secret_key VARCHAR(40),
	access_key VARCHAR(20)
);

-- Test user insert
INSERT INTO USERS (username, password) VALUES ('rjwv', crypt('123456', gen_salt('bf', 8)));

-- Table for products along with a few sample inserts
CREATE TABLE PRODUCTS
(
	product_id SERIAL PRIMARY KEY,
	title VARCHAR NOT NULL,
	price NUMERIC
);

INSERT INTO PRODUCTS (title, price) VALUES ('Behemoth', 9.99);
INSERT INTO PRODUCTS (title, price) VALUES ('NIN', 19.99);
INSERT INTO PRODUCTS (title, price) VALUES ('Tool', 51.95);
INSERT INTO PRODUCTS (title, price) VALUES ('SONOIO', 5.99);
INSERT INTO PRODUCTS (title, price) VALUES ('Def Lepperd', 20.99);