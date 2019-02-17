CREATE OR REPLACE FUNCTION storedproc(id integer)
RETURNS setof products AS $func$
DECLARE
SQL text:='SELECT * FROM products WHERE id = $1';
BEGIN
    RETURN QUERY EXECUTE SQL
USING id;
END;
$func$ 
LANGUAGE plpgsql;