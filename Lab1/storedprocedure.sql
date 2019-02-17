CREATE OR REPLACE PROCEDURE storedprocedure(_id TEXT)
AS $$
BEGIN
    SELECT * FROM users where id = _id;
END;
$$
LANGUAGE sql;