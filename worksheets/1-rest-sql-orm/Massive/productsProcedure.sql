//run this function in Postgres
CREATE OR REPLACE FUNCTION products(IN t_title VARCHAR(255)) 
RETURNS setof products 
AS $BODY$ 
BEGIN RETURN QUERY 
SELECT * FROM PRODUCTS WHERE TITLE LIKE '%' || t_title || '%' ORDER BY PRICE ASC; END; 
$BODY$ LANGUAGE plpgsql;
