CREATE TABLE users
(
 id INTEGER NOT NULL,
 user_name CHARACTER VARYING(100) UNIQUE,
 password CHARACTER VARYING(255),
 -- key stored in base64 where 160 bits can be represented by 28 base64 characters
 access_key CHARACTER VARYING(28),
  -- key stored in base64 where 320 bits can be represented by 56 base64 characters
 secret_key CHARACTER VARYING(56),
 CONSTRAINT users_pk PRIMARY KEY(id)
);

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


CREATE TABLE video_games (
    id INTEGER NOT NULL,
    title CHARACTER VARYING(255),
	rating NUMERIC,
    price NUMERIC,
	CONSTRAINT video_games_pk PRIMARY KEY(id)
);

CREATE SEQUENCE video_games_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;