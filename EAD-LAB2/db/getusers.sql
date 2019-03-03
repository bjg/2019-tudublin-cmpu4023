SELECT username, password FROM "users"
	WHERE username = $1
AND password = crypt($2, password);
