CREATE OR REPLACE FUNCTION get_products_by_title (p_name VARCHAR) 
 RETURNS TABLE (
 id INT,
 title VARCHAR,
 price NUMERIC,
 created_at TIMESTAMPTZ,
 deleted_at TIMESTAMPTZ,
 tags VARCHAR[]
) 
AS $$
BEGIN
 RETURN QUERY SELECT *
 FROM products  p
 WHERE p.title LIKE '%' || p_name || '%' ORDER BY p.price ASC;
END; $$ 
 
LANGUAGE 'plpgsql';