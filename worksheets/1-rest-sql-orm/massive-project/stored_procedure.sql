CREATE OR REPLACE FUNCTION get_product (p_pattern VARCHAR)
RETURNS TABLE (
    product_title VARCHAR,
    product_price NUMERIC,
    product_created_at TIMESTAMP WITH TIME ZONE,
    product_deleted_at TIMESTAMP WITH TIME ZONE,
    product_tags CHARACTER varying(255)[]
)
AS $$
BEGIN
    RETURN QUERY SELECT
    title, price, created_at, deleted_at, tags
    FROM products
    WHERE title ILIKE p_pattern;
END; $$

LANGUAGE 'plpgsql';