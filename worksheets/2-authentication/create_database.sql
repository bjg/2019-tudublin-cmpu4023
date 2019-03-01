CREATE EXTENSION pgcrypto;

-- This drop statement isn't strictly needed since dropping the table drops all its triggers too.
DROP TRIGGER IF EXISTS hash_password_trigger on users;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

CREATE TABLE users (
	username TEXT,
	hashed_password TEXT
);

CREATE TABLE products (
	name TEXT,
	price FLOAT
);

-- Function to salt and hash passwords on insert or update to users table.
-- Only executes on update if the password is being changed.
CREATE OR REPLACE FUNCTION hash_password_func() RETURNS trigger AS
$$
BEGIN
	IF (TG_OP = 'INSERT') THEN
		raise notice 'Hashing password for new user %', NEW.username;
		NEW.hashed_password = crypt(NEW.hashed_password, gen_salt('bf'));
	ELSIF (TG_OP = 'UPDATE' AND OLD.hashed_password IS DISTINCT FROM NEW.hashed_password) THEN
		raise notice 'Hashing updated password for user %', NEW.username;
		NEW.hashed_password = crypt(NEW.hashed_password, gen_salt('bf'));
	END IF;
	RETURN NEW;
END
$$
LANGUAGE PLPGSQL;

CREATE TRIGGER hash_password_trigger
BEFORE INSERT OR UPDATE
ON users
FOR EACH ROW EXECUTE PROCEDURE hash_password_func();
