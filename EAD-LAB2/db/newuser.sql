INSERT INTO "users" (username, password)
     VALUES ($1, crypt($2, gen_salt('bf', 8)))
RETURNING username;