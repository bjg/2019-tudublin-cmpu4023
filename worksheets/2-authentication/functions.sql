CREATE EXTENSION pgcrypto;

CREATE OR REPLACE PROCEDURE create_user (IN p_user_name VARCHAR, IN p_password VARCHAR)
AS $$
	DECLARE seq INTEGER;
BEGIN
	SELECT nextval('users_id_seq') INTO seq ;
	INSERT INTO users VALUES(seq, p_user_name, crypt(p_password, gen_salt('md5')));
END; $$ 

LANGUAGE 'plpgsql';


CREATE OR REPLACE FUNCTION verify_user (IN p_user_name VARCHAR, IN p_password VARCHAR) RETURNS BOOLEAN
AS $$
DECLARE auth BOOLEAN := false;
DECLARE v_password CHARACTER VARYING(255) := NULL;
BEGIN
	SELECT password INTO v_password FROM users WHERE user_name = p_user_name;
	
	IF v_password = NULL THEN
		RETURN FALSE;
	END IF;
	
	SELECT (password = crypt(p_password, password)) INTO auth FROM users WHERE user_name = p_user_name;
	
	RETURN auth;
END; $$ 

LANGUAGE 'plpgsql';

CREATE OR REPLACE PROCEDURE create_video_game (IN p_title VARCHAR, IN p_rating NUMERIC, IN p_price NUMERIC)
AS $$
	DECLARE seq INTEGER;
BEGIN
	SELECT nextval('video_games_id_seq') INTO seq ;
	INSERT INTO video_games VALUES(seq, p_title, p_rating, p_price);
END; $$ 

LANGUAGE 'plpgsql';

CREATE OR REPLACE PROCEDURE update_keys (IN p_id INTEGER, IN p_access_key VARCHAR, IN p_secret_key VARCHAR)
AS $$
	DECLARE seq INTEGER;
BEGIN
	UPDATE users SET access_key = p_access_key, secret_key = p_secret_key WHERE id = p_id;
END; $$ 

LANGUAGE 'plpgsql';