create or replace function get_prods(x character varying)
returns setof products
AS
$$
    select * from products where title = x;
$$
language sql;
