create or replace function all_products()
returns setof products
as
$$
select * from products;
$$
language sql;