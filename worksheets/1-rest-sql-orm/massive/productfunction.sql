create or replace function find_product(name varchar(255))
returns setof products
as $$
begin
	return query select * from products where products.title like '%' || name || '%';
end;
$$ LANGUAGE plpgsql;
