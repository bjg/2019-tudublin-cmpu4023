CREATE OR REPLACE FUNCTION public.get_products(_title text)
    RETURNS SETOF PRODUCTS
    LANGUAGE 'sql'
    AS $BODY$ 
    	SELECT * FROM products p 
    	WHERE p.title = _title; $BODY$;