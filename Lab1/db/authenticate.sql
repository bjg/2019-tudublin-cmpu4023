CREATE OR REPLACE FUNCTION authenticate(_email TEXT, _passwd TEXT)
RETURNS TABLE(id varchar)
AS $$
    SELECT u.id
    FROM users u
    WHERE u.email = _email
    AND u.password = _passwd
$$ LANGUAGE SQL STRICT IMMUTABLE;