-- create or replace function find_product(name varchar(255))
-- returns
	-- table(
		-- id int,
		-- title varchar,
		-- price numeric,
		-- created_at timestamptz,
		-- deleted_at timestamptz,
		-- tags varchar[]
	-- )
-- as $$
-- begin
	-- return query select * from products where products.title like '%' || name || '%';
-- end;
-- $$ LANGUAGE plpgsql;

create or replace function find_product(name varchar(255))
returns setof products
as $$
begin
	return query select * from products where products.title like '%' || name || '%';
end;
$$ LANGUAGE plpgsql;
