DROP FUNCTION public.get_products(text);
CREATE OR REPLACE FUNCTION public.get_products(
	_title text)
    RETURNS SETOF products 
    LANGUAGE 'sql'
    AS $BODY$ SELECT * FROM products prod WHERE prod.title = _title; $BODY$;
ALTER FUNCTION public.get_products(text)
    OWNER TO katie;