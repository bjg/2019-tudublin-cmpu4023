## part 1

### GET /users

curl http://localhost:3000/users
Using Massive, I queried that data with the following query ""'select email, details -> \'sex\' as sex from users"

### GET /users/:id

curl http://localhost:3000/users/2
An API end point was created to query a product by id using. Using Massive, I queried that data with the following query ""'select email, details -> \'sex\' as sex from users WHERE id='  + req.params.id"
The req.params returns the parameters in the matched route. Using that I am able to retrieve the user id.
If data is returned from database, it is returned as a response otherwise, a message saying 'No user with that id' will be sent as a response.


###GET /products

curl http://localhost:3000/products
Using Massive, I queried that data with the following query 'select * from products ORDER BY price ASC;"

###GET /products/:id

Show details of the specified products

curl http://localhost:3000/products/1
Using Massive, I queried that data with the following query "'select * from products WHERE id=' + req.params.id"
The req.params returns the parameters in the matched route. Using that I am able to retrieve the product id.


###GET /purchases

curl http://localhost:3000/purchases
The API endpoint simply uses MassiveJS to perform an SQL query and return the output.
The following query was performed at this API endpoint

select price, purchase_items.state, purchase_id, name, address, email from purchase_items
join purchases on purchase_items.purchase_id = purchases.id
join users on users.id = purchases.user_id
ORDER BY price DESC

## Part 2

###GET /products[?name=string]

curl http://localhost:3000/products?name=Romantic
The API from part one was extending by checking if a query parameter with the key name was included, if it was we would perform a different SQL query where we filter for the name
I was able to access the query parameter using the query field in the request that was sent.
I used the following SQL query to get the product by name
"select * from products where title= '" + req.query.name + "'"

The query above is badly implemented and can be injected with the following query param
?name='; delete from purchase_items where product_id=12; DELETE FROM products where id=12 or title='


## part 3
-parameterised query
The /productsInjectionSafe1 endpoint using the parameterised query
The following query is performed which no longer allows for the sql injection demonstrated in the previous part
'select * from products where title = ${name};', { name: req.query.name, })

-Stored procedure
The /productsInjectionSafe2 api endpoint implements a second way of preventing the sql injection shown in the previous part

The following procedure was created, (Note: It was created through the shell)

 create or replace function select_products(Name VARCHAR(30) )
 returns setof products
 as
 $$
 select * from products where title = Name;
 $$
 language sql;

With these two methods the SQL injection shown in part 3 no longer works.



## part 4
Models have been created for all tables (products, purchases, purchase_items, users)
appropriate associations and referential integrity have been set up in the models.

All models can be found in the directory: worksheets/1-rest-sql-orm/part2/models/

## part 5
The models have been populated with dummy data
path: worksheets/1-rest-sql-orm/part2/populate.js

## Part 6

##GET /products[?name=string] - List all products

Call API endpoint to request all products:
curl -X GET \
  http://localhost:3000/products \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 0364af14-edfe-4769-a7c3-75382736424c' \
  -H 'cache-control: no-cache'


Calling API endpoint for a specific product name:
 curl -X GET \
   'http://localhost:3000/products?name=Romantic' \
   -H 'Content-Type: application/json' \
   -H 'Postman-Token: bad535e6-053d-45b7-a3dc-6a82cb524494' \
   -H 'cache-control: no-cache'



## GET /products/:id - Show details of the specified products

curl -X GET \
  http://localhost:3000/products/2 \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: c47a5da4-8393-4e5c-a946-65b30c2801c2' \
  -H 'cache-control: no-cache'


## POST /products - Create a new product instance

curl -X POST \
  http://localhost:3000/products \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: 9a9f7ab9-24bb-4f95-b426-d34a0baf8081' \
  -H 'cache-control: no-cache' \
  -d '{
	"title": "example post",
	"price": 100,
	"tags": ["tag1", "tsg2", "tag3"]
}'


## PUT /products/:id - Update an existing product

curl -X GET \
  http://localhost:3000/products/45 \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: e5ff3d5d-6831-46d5-a377-ec8398abf5b6' \
  -H 'cache-control: no-cache' \
  -d '{
	"title": "example post",
	"price": 100,
	"tags": ["tag1", "tsg2", "tag3"]
}'


## DELETE /products/:id - Remove an existing product

curl -X DELETE \
  http://localhost:3000/products/45 \
  -H 'Content-Type: application/json' \
  -H 'Postman-Token: dd4f2c59-4d73-4cc7-b0ad-e307cf674248' \
  -H 'cache-control: no-cache' \
  -d '{
	"title": "example post",
	"price": 100,
	"tags": ["tag1", "tsg2", "tag3"]
}'
