## Massive.js Application - Parts 1-3

I set up the pgguide database as described in the *Setting Up* section of the worksheet
and configured an Express application with Massive.js Installed.

I connected the application to the pgguide database and then set up the following routes

```sh
GET /users
GET /users/:id
GET /products
GET /products/:id
GET /purchases
```

I then configured the following route 

```sh
GET /products[?name=string]
```

Which would take a name value with from the URL query string and then return a product with the same name.
The route was written in a vulnerable way so that user would type in this in the url:

```sh
/products?name=Dictionary'; update products set price = 0 where id =1; -- 
```

Then they would inject an Update scritp which would set the price of the product of id of 1 to 0
> **Note:** Similar to this any other SQL query could be injected into the script including a DELETE query

Finally I configured the following two routes which were written in a way that would prevent any SQL:

1. `GET /products-parameterised` : This route used a preapred statement which removed any sql injection
2  `GET /products-stored-procedure' : This route used a stored procedure

## Sequelize Application - Parts 4 - 6

### Sequelize Setup - Part 4
For part 4 of the lab work I first initialised a new project by executing the command

```sh
npm init -y
```

I then installed the following packages for the project

```sh
npm install --save express nodemon sequelize sequelize-cli pg pg-hstore
```

Once I had all the packages installed to use sequelize and the sequeliz-cli I then configure 
a **.sequelizerc** file which would tell sequelize-cli where to store the migration,model,seed and config files.

Finally I ran the following command 

```sh
node_modules/.bin/sequelize init
```

Which created a server folder, that contain migrations,models and seeders folders in it as well as a config.js file.
config.js contained the configurations for the database I was going to work with.

After I finished configuring the connection to the database It was time to generate the table models for the database through sequeliz-cli
by running this command:

```sh
node_modules/.bin/sequelize model:create Name_of_Model --attributes "attribute_name:data_type , attribute_name:data_type"
```

The models that were created had an identical structure to the tables in the pgguide database.
> **Note:** Corresponding migration files were also generated for each model

Finally I configured the associations between the models, so they would mimick the relationship between the tables that were already in the pgguide database

Using the command `node_modules/.bin/sequelize db:migrate` I ran the migration files which created 4 new tables In the database:
	- seqProducts
	- seqUsers
	- seqPurchases
	- seqPurchses_Items
Which had the exact same structure and relationships as the tables
	- products
	- users
	- purchases
	- purchase_items
That were initially in the pgguide database
	

### Sequelize seeding - populating the database - part 5
After the models were created it was time to populate the database with test some data.

For this I used seeders which are files that are generated using the following command:

```sh
node_modules/.bin/sequelize seed:create --name seed_file_name
```

I created a seed file for each of the sequelize models I made and added data in them that I wanted to add to to the corresponding models

Finally I populated the sequelize models by running the seed files with the following command:

```sh
node_modules/.bin/sequelize seed:all
```


### Routes for API - Part 6
For part 6 of the worksheet I created a new app.js file where I configured a REST API with the followig routes:


1. GET `/products[?title=product_title]`
	- Returns a list of all the products available in the seqProducts table
	- You can also look up a specific product by title using the query string like **/products?title=product_title**

2. GET `/products/:id`
	- Returns a product with the id being passed in through the URL
	- Example **/products/4**
	
3. POST `/products`
	- Adds a new record for the product
	- The body of the POST request can contain the following: 
		- product 
		- title
		- price
		- quantity
		- tags
		
4. PUT `/products/:id`
	- This PUT request updates a specifict product by passing the product id of the product to be updated throught the URL
	- The values that can be updated are the price and quantity of the product and they are passed through the body
	
5. DELETE `/product/:id`
	- By making a http DELETE request to the API and passing a product ID through the URL, the record with that product ID gets deleted
	
	
For testing purposes I also left in some additional routes:
- GET `/addUser[?email=""&password=""&details={}&deleted_at=]`
	-This route adds a user by passing the following parameters through the query string in the URL:
		- email :string
		- password : string
		- details : JSON
		- deleted_at : timestamp
		
- GET `/addProducts[?title=""&price=&quantity=&tags=[]]`
	- This route adds a product by passong the followig parameters through the query string in the URL:
		- title : string
		- price : float
		- quantity : integer
		- tags : [strings]
		
- GET `/purchases[?name="string"&address="string"&state="string"&zipcode=integer&created_at=timestamp&userId=integer]`
	- This route returns the contents of the purchases table but you can also add a record to the seqPurchases through the query string of the URL like:
	`/pruchases?name="string"&address="string"&state="string"&zipcode=integer&created_at=timestamp&userId=integer`
	
-GET `/purchase_items[?price=&quantity&state=""&purchaseId=&productId=]`
	- This returns the contents of the seqPurchses_Items table but you can also add a record to it through the query string of the URL like :
	`/purchase_items?price=&quantity&state=""&purchaseId=&productId=`
	