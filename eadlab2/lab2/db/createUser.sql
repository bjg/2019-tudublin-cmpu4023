INSERT INTO "users"(username, password)
     VALUES (lower($1), crypt($2, gen_salt('bf', 8)))
  RETURNING username;