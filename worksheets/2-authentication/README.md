Add any additional documentation here...

PQSL Set up commands

CREATE EXTENSION pgcrypto;

CREATE TABLE s_users ( id SERIAL PRIMARY KEY, username TEXT NOT NULL UNIQUE, password TEXT NOT NULL);

insert into the s_users with the new hashed password using crypt and gen_salt that uses the blowerfish algo

INSERT INTO s_users (username, password) VALUES ('c15346551',crypt('c15346551', gen_salt('bf')));
