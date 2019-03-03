DROP FUNCTION public.findproducts(text);
CREATE OR REPLACE FUNCTION public.findproducts(
	_title text)
    RETURNS SETOF products 
    LANGUAGE 'sql'
    AS $BODY$ SELECT * FROM products p WHERE p.title = _title; $BODY$;

ALTER FUNCTION public.findproducts(text)
    OWNER TO aaron;