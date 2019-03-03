# Worksheet 1
This labsheet is broken into two seperate folders one for massive.js and one for sequilize

## Massive
### Part 1: EndPoints
1. GET /users 

Below is the code snippet lists all users email and sex in order of most recently created when the /users endpoint is invoked
```javascript
app.get('/users', (req, res) => {
    db.users.find({},{
            fields: ["email", "details::json"],
            order: [{
                field:'created_at', 
                direction: 'desc',
            }]
    })
```

The images show the JSON output of the above code when the query is invoked in the browser. First image is raw output the second query is pretty printed
![alt text][users]
![alt text][users_pp]

2. GET /users/:id

The below code is similar to the one above except is uses massives in built function findOne and I removed the order function.

```javascript
app.get('/users/:id', (req, res) => {
    db.users.findOne(req.params.id,
    {
            fields: ["email", "details::json"]
    })
```
The output of the above query.
![alt text][users_id]


3. GET /products

The below code lists all products in ascending order of price when /products endpoint is invoked

```javascript
app.get('/products', (req, res) => {
   db.products.find({},{
      order: [{
        field:'price', 
        direction: 'asc',    
      }]
   }) 
```
The images show the JSON output of the above code when the query is invoked in the browser. First image is raw output the second query is pretty printed
![alt text][products]
![alt text][products_pp]

4. GET /products/:id

The code below provided details of a specified product when the endpoint is invoked
```javascript
app.get('/products/:id', (req, res) => {
    db.products.findOne(req.params.id,
    {})
```
![alt text][products_id]


5. GET /purchases

The code snippet below lists purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, quantity and delivery status of the purchased item. Order by price in descending order.
This query is different to the rest as it includes a raw query rather than an in built function. 
```javascript
app.get('/purchases', (req, res) => {
    db.query(
        `select purchases.name, purchases.address, users.email,purchase_items.price, purchase_items.quantity, purchase_items.state 
        from users, purchases, purchase_items
        where purchase_items.purchase_id = purchases.id
        and purchases.user_id =users.id
        order by price desc;`,
    })
```
The two images below display the invoked enpoint. One version is a raw JSON format and another pretty printed
![alt text][purchases]
![alt text][purchases_pp]

### Part 2: SQL Injection
Implementing GET /products[?name=string] badly to allow for SQL injection.
The below code takes the users input through: /products?name=foo. For example name will become foo  and it will be searched for in the products table. To inject SQL into this query **/products?name=Action';Delete from products where id=43;--** The images below show the before that the product exist, it shows the sql injection in the adress bar and the after effects of where the Book product no longer exists
```javascript
app.get('/products', (req, res) => {
  db.query(
        "select * from products where title = '" + req.query.name +"';"
         )
   })
```
![alt text][sql_injection_before]
![alt text][sql_injected]
![alt text][sql_injection_after]

### Part 3:  SQL Injection prevention
#### Parameterised Query
Using a parameterised query within the raw SQL stops the sql injection. The code snippet below shows the implementation of this. When you pass in a paramter like the one above **/products?name=Action';Delete from products where id=43;--** this gets rejected because the program is looking for parameter and can tell something isn't right
```javascript
app.get('/products', (req, res) => {
  db.query(
       "select * from products where title = ${name}", {name: req.query.name}
        )
   })
```
#### Stored Procedure 
A stored procedure is a function that is stored on the database. It knows what it is looking for as it has already been coded. So passing in anything that it isn't expecting throws an error or gets rejected. Below is the sql function that I created. 
```sql
CREATE OR REPLACE FUNCTION public.findproducts(
	_title text)
    RETURNS SETOF products 
    LANGUAGE 'sql'
    AS $BODY$ SELECT * FROM products p WHERE p.title = _title; $BODY$;
```
Both methods rejected the sql injection. Screenshots don't show anything so I haven't added any. 

[users]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/users.png "Image of users Query raw"
[users_pp]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/users_pp.png "Image of users Query pretty printed"
[users_id]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/users_id_pp.png "Image of users/:id Query pretty printed"
[products]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/products_raw.png "Image of products query raw format"
[products_pp]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/products_pp.png "Image of products query pp format"
[products_id]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/products_id_pp.png "Image of products/:id query pp format"
[purchases]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/purchases_raw.png "Image of purchases raw"
[purchases_pp]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/purchases_pp.png "Image of purchases"
[sql_injection_before]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/query_before.png "Images of before SQL injection"
[sql_injected]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/sqp_injection.png "Image showing the sql injection"
[sql_injection_after]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Massive/images/query_after.png "Image of after the SQL injection"
