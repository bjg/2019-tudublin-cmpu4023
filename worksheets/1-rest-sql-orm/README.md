
# Massive-js

## /users

```bash
curl -i -H "Accept: application/json" -X GET http://localhost:3000/users
```
	HTTP/1.1 200 OK
	X-Powered-By: Express
	Content-Type: application/json; charset=utf-8
	Content-Length: 2395
	ETag: W/"95b-AGZeXUJI+ePuKBxk2dQ5VtqiaYU"
	Date: Sun, 17 Feb 2019 14:53:32 GMT
	Connection: keep-alive

	[{"email":"Romaine.Birdsell@aol.com","sex":"F"},{"email":"Ivana.Sosnowski@aol.com","sex":"M"},{"email":"Cherryl.Tarnowski@gmail.com","sex":null},{"email":"Zita.Luman@yahoo.com","sex":null},{"email":"Takako.Gilpatrick@aol.com","sex":"M"},{"email":"Derek.Crenshaw@gmail.com","sex":"F"},{"email":"Jeremiah.Buonocore@yahoo.com","sex":null},{"email":"Samatha.Pellegrin@yahoo.com","sex":null},{"email":"Danny.Crays@gmail.com","sex":"M"},.... and so on

	
## /users/id
	
```bash
curl -i -H "Accept: application/json" -X GET http://localhost:3000/users/1
```
	HTTP/1.1 200 OK
	X-Powered-By: Express
	Content-Type: application/json; charset=utf-8
	Content-Length: 50
	ETag: W/"32-Wa3DdcDj6oERw39cy09uuyjSAww"
	Date: Sun, 17 Feb 2019 14:56:22 GMT
	Connection: keep-alive

	[{"email":"Earlean.Bonacci@yahoo.com","sex":null}]

## /products
	
```bash
curl -i -H "Accept: application/json" -X GET http://localhost:3000/products
```

	HTTP/1.1 200 OK
	X-Powered-By: Express
	Content-Type: application/json; charset=utf-8
	Content-Length: 3160
	ETag: W/"c58-/hRgqU7ks7BNGYn0YsiaX/mZgS0"
	Date: Sun, 17 Feb 2019 15:00:15 GMT
	Connection: keep-alive

	[{"id":5,"title":"Coloring Book","price":"5.99","created_at":"2011-01-01T20:00:00.000Z","deleted_at":null,"tags":["Book","Children"]},{"id":4,"title":"Baby Book","price":"7.99","created_at":"2011-01-01T20:00:00.000Z","deleted_at":null,"tags":["Book","Children","Baby"]},{"id":1,"title":"Dictionary","price":"9.99","created_at":"2011-01-01T20:00:00.000Z","deleted_at":null,"tags":["Book"]},{"id":11,"title":"Classical CD","price":"9.99","created_at":"2011-01-01T20:00:00.000Z","deleted_at":null,"tags":["Music"]},{"id":12,"title":"Holiday CD","price":"9.99","created_at":"2011-01-01T20:00:00.000Z","deleted_at":null,"tags":["Music"]},{"id":13,"title":"Country CD","price":"9.99","created_at":"2011-01-01T20:00:00.000Z","deleted_at":null,"tags":["Music"]}.... and so on

## /products/id

```bash
curl -i -H "Accept: application/json" -X GET http://localhost:3000/products/1
```

	HTTP/1.1 200 OK
	X-Powered-By: Express
	Content-Type: application/json; charset=utf-8
	Content-Length: 120
	ETag: W/"78-0vkJfH+YxsmiXdvOR77Bxxuc0QU"
	Date: Sun, 17 Feb 2019 15:01:22 GMT
	Connection: keep-alive

	[{"id":1,"title":"Dictionary","price":"9.99","created_at":"2011-01-01T20:00:00.000Z","deleted_at":null,"tags":["Book"]}]

## /products injection statement

Book';delete from products where id = 300;--

```bash
curl -i -H "Accept: application/json" -X GET http://localhost:3000/dodgy-products?name=Book%27%3Bdelete%20from%20products%20where%20id%20%3D%20300%3B--
```

	HTTP/1.1 200 OK
	X-Powered-By: Express
	Content-Type: application/json; charset=utf-8
	Content-Length: 2
	ETag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
	Date: Sun, 17 Feb 2019 15:05:32 GMT
	Connection: keep-alive

	[]

As we can see no error occured so the injection was successful, a request for the record with id 300 will now return a blank

## /products with function

```bash
curl -i -H "Accept: application/json" -X GET http://localhost:3000/function-products?name=Python
```

	HTTP/1.1 200 OK
	X-Powered-By: Express
	Content-Type: application/json; charset=utf-8
	Content-Length: 145
	ETag: W/"91-+r6lbxHrmF8rL4172Kmm7aUSWGM"
	Date: Sun, 17 Feb 2019 15:15:49 GMT
	Connection: keep-alive

	[{"id":2,"title":"Python Book","price":"29.99","created_at":"2011-01-01T20:00:00.000Z","deleted_at":null,"tags":["Book","Programming","Python"]}]
	
## /products with paramterised query

```bash
curl -i -H "Accept: application/json" -X GET http://localhost:3000/products?name=Python
```

	HTTP/1.1 200 OK
	X-Powered-By: Express
	Content-Type: application/json; charset=utf-8
	Content-Length: 137
	ETag: W/"89-tUjjthdA/U/fhJTYj43yKocThIk"
	Date: Sun, 17 Feb 2019 15:17:50 GMT
	Connection: keep-alive

	[{"id":4,"title":"Baby Book","price":"7.99","created_at":"2011-01-01T20:00:00.000Z","deleted_at":null,"tags":["Book","Children","Baby"]}]
	
## /purchases

```bash
curl -i -H "Accept: application/json" -X GET http://localhost:3000/purchases
```
	
	too large to copy, here's an sample
	...{"id":766,"created_at":"2011-05-21T03:01:00.000Z","name":"Hildred Currier","address":"4301 44th Ave.","email":"Takako.Gilpatrick@aol.com","price":"9.99","quantity":2,"state":"Pending"},{"id":767,"created_at":"2011-05-22T16:33:00.000Z","name":"Misty Chaffee","address":"8261 California St.","email":"Zita.Luman@yahoo.com","price":"529.00","quantity":2,"state":"Delivered"},{"id":767,"created_at":"2011-05-22T16:33:00.000Z","name":"Misty Chaffee","address":"8261 California St.","email":"Zita.Luman@yahoo.com","price":"9.99","quantity":2,"state":"Delivered"},{"id":768,"created_at":"2011-11-03T21:27:00.000Z","name":"Cortney Kipp","address":"6494 Washington Ave.","email":"Samatha.Hedgpeth@yahoo.com","price":"9.99","quantity":4,"state":"Delivered"}..and so on

# Sequelize

Models contained in sequelized/models, new inserted data in sequelized/seeders

## GET /products, GET products/id, GET /users, GET users/id, GET /purchases/id

Same as in massive-js, except also with the new records generated by the seed files

## POST /products

```bash
curl --data "id=600&title=New%20Book&price=200&tags=Book%20New" http://localhost:3000/products
```

	{"id":600,"title":"New Book","price":"200","created_at":"2019-02-17T15:42:04.607Z","tags":["Book","New"],"deleted_at":null}

## PUT /products/id

```bash
curl -X PUT -d "price=600" http://localhost:3000/products/600
```

	{"id":600,"title":"New Book","price":"500","created_at":"2019-02-17T15:27:15.633Z","deleted_at":null,"tags":["Book)New"]}
	
## DELETE /products/id

```bash
curl -X DELETE http://localhost:3000/products/600
```

Deletes the record