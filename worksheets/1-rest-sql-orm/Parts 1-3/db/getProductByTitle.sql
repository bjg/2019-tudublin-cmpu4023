CREATE OR REPLACE FUNCTION getProductByTitle(_title TEXT) RETURNS SETOF products AS $$
SELECT * from products where title = _title;
$$ LANGUAGE SQL STRICT IMMUTABLE;