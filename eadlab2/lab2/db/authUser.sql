SELECT username
  FROM "users"
 WHERE username = lower($1)
       AND password = crypt($2, password);