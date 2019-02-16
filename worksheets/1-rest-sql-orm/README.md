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


## Sequelize 
Before I talk about everything in Sequilize I am just going to layout the file structure for clarity.
```
Root
├── node_module
├── server
│   ├── migrations
|   |	├──20190213173340-create-users.js
|   |	├──20190213173702-create-products.js
|   |	├──20190213173902-create-purchases.js
|   |	└──20190213174246-create-purchase-items.js
|   ├── models
|   |	├──index.js
|   |	├──users.js
|   |	├──products.js
|   |	├──purchases.js
|   |	└──items.js
|   ├── router
|   |	├─routes
|   |	|  └──products.js
|   |	└──router.js
│   ├── seeders
|   |	├──20190213181540-test-user.js
|   |	├──20190214145808-products_populate.js
|   |	├──20190215015750-purchases_populate.js
|   |	└──20190215145731-purchase_items_populate.js
|   └──config.js
├── index.js
└── package.json
```
### Part 4:Sequalize migrations
To migrate the files to the pgguide database and to ensure connectivity I ran the following lines of code for each table
```
sequelize model:generate --name Users --attributes id:integer,email:string,password:string,details:hstore,created_at:date,deleted_at:date
sequelize model:generate --name Products --attributes id:integer,title:string,price:decimal,created_at:date,deleted_at:date,tags:array
sequelize model:generate --name Purchases --attributes id:integer,created_at:date,name:string,address:string,state:string,zipcode:integer,user_id:integer
sequelize model:generate --name Purchases_items --attributes id:integer,purchase_id:integer,product_id:integer,price:decimal,quantity:integer,state:string
```
This created new model and new migration files for each table The layout can be seen above. I edited the index file in modles folder to contain the relationships between the tables as seen in this screenshot:

![alt text][relationships]

I also edited products.js, purchases.js and users.js in the models directory to point the createdAt and deletedAt fields to their corresponding fields in the pgguide tables created_at and deleted_at.
![alt text][products_model]
![alt text][purchase_model]
![alt text][users_model]

To help further maintain referential integrity I also made some changes in 20190213174246-create-purchase-items.js and 20190213173902-create-purchases in the migration directory. These changes, seen below, where to ensure that the foregin keys where pointed at the right table and column.
Purchases:
```javascript
user_id: {
        type: Sequelize.INTEGER,
        references:{
          model: 'users',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
```
Purchase_items:
```javascript
purchase_id: {
        type: Sequelize.INTEGER,
        references:{
          model: 'purchases',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      product_id: {
        type: Sequelize.INTEGER,
        references:{
          model: 'products',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
```

After all the edits where done it was time to migrate the table to the database using the following command
```
sequelize db:migrate
```
When I queried the database the SequelizeMeta table existed and all the tables where there.

### Part 5:Populating the database

To populate the database with my own test data I used bulk inserts and seed files. I generted the seed files using:
```
sequelize seed:generate --name <name_of_file>
```
Then I edited each one to insert some test data screenshots of the inserts are shown below:

![alt text][users_inserts]
![alt text][items_insert]
![alt text][purchases_inserts]
![alt text][products_inserts]

To insert the data the below command was run. It is important to note that the order in which they run is important as it is with most SQL to maintain referentail integritity
```
sequelize db:seed:all
```
### Part 6: CRUD operations

1. GET /products

curl to list all products
```
curl http://localhost:3000/products
```
![alt text][curl_products]
2. GET /products/:id

Show details of the specified products
```
curl http://localhost:3000/products/24
```
![alt text][curl_prod_id]

3. POST /products

Create a new product instance
```
curl --data "title=Greatest%20Pop%20Songs&price=19.00&tags=Music,Pop"  http://localhost:3000/products
```
![alt text][curl_post_out]

4. PUT /products/:id

Update an existing product
Before curl:
![alt text][curl_update]

```
curl -X PUT -d "price=14.25" http://localhost:3000/products/48
```
After curl:
![alt text][curl_update_after]

5. DELETE /products/:id

Remove an existing product
![alt text][del_before]
```
curl -X DELETE http://localhost:3000/products/48
```
In the below screenshot you can see the number 1 wa returned which means one record was deleted
![alt text][del_curl]
![alt text][del_after]

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
[curl_delete]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/curl_delete.png "curl delete"
[curl_get]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/curl_get.png "curl get"
[curl_post]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/curl_post.png "curl post"
[curl_put]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/curl_put.png "curl put"
[items_insert]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/items_insert.png "items_insert"
[items_migration]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/items_migration.png "items_migration"
[items_model]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/items_model.png "items_model"
[products_inserts]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/products_inserts.png "products_insert"
[products_migration]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/products_migration.png "products_migration"
[products_model]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/products_model.png "products_model"
[purchases_inserts]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/purchases_inserts.png "purchases_insert"
[purchase_model]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/purchase_model.png "purchase_model"
[purchases_migration]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/purchases_migration.png "purchases_migration"
[users_migration]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/users_migration.png "users_migration"
[users_inserts]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/users_inserts.png "users_inserts"
[users_model]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/users_model.png "users_model"
[relationships]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/relationships.png "relationships"
[curl_products]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/curl_products_out.png "results"
[curl_prod_id]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/curl_products_id_out.png "results"
[curl_post_out]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/curl_post_out.png "results"
[curl_update]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/update_proof.png "proof"
[curl_update_after]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/update_proof_after.png "After"
[del_after]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/proof_before.png "after"
[del_before]: https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/proof_aftet.png "Before"
[del_curl]:https://github.com/AaronAnthonyByrne/2019-tudublin-cmpu4023/blob/C15709609-wks-1/worksheets/1-rest-sql-orm/Sequilize/Images/curl_delete_out.png
