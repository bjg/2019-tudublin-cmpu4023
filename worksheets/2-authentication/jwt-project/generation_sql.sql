CREATE SEQUENCE users_id_sequence;
CREATE TABLE users (
    id INTEGER NOT NULL DEFAULT nextval('users_id_sequence'),
    username VARCHAR(255),
    email VARCHAR(255),
    password TEXT NOT NULL
);

CREATE SEQUENCE product_id_sequence;
CREATE TABLE product (
    id INTEGER NOT NULL DEFAULT nextval('product_id_sequence'),
    title VARCHAR(255),
    price NUMERIC
);

CREATE SEQUENCE api_key_sequence;
CREATE TABLE api_key (
    id INTEGER NOT NULL DEFAULT nextval('api_key_sequence'),
    access_key TEXT,
    secret_key TEXT,
    user_id INTEGER REFERENCES users(id)
);