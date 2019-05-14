const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const massive = require('massive');

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: '8myd!nner',
  ssl: false,
  poolSize: 10
}).then(instance => {
    app.set('db',instance);
//QUESTION 1

    //List all users email and sex in order of most recently created. Do not include password hash in your output
    app.get('/users', (req,res) => {
        instance.query('SELECT email, details FROM users ORDER BY created_at DESC').then(users => res.send(users));
    });

    //Show above details of the specified user
    app.get('/users/:id', (req,res) => {
        instance.query(`SELECT * FROM users WHERE id = ${req.params.id}`).then(users => res.send(users));
    });
    

    //List all products in ascending order of price
    app.get('/products', (req,res) => {
        instance.query('SELECT * FROM products ORDER BY price DESC').then(users => res.send(users));
    });

    //Show details of the specified products
    app.get('/products/:id', (req,res) => {
        instance.query(`SELECT * FROM products WHERE id = ${req.params.id}`).then(users => res.send(users));
    });
    

    //List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, 
    //quantity and delivery status of the purchased item. Order by price in descending order
    app.get('/purchases', (req,res) => {
        instance.query('SELECT pi.price, pi.quantity, pi.state, p.name, p.address, u.email '
                        + 'FROM purchase_items pi '
                        + 'INNER JOIN purchases p '
                        + 'on pi.id = p.id '
                        + 'INNER JOIN users u '
                        + 'on p.user_id = u.id '
                        + 'ORDER BY price DESC').then(users => res.send(users));
    });


//QUESTION 2

    /*
    Building on your solution to part 1 for the API to the products resource from the pgguide database, 
    extend the product indexing endpoint to allow the filtering of products by name as follows

    GET /products[?name=string]

    For your solution you should implement the query (badly) in such a way as to allow an attacker to inject arbitrary SQL 
    code into the query execution. Show, using your badly implemented approach, 
    how an attacker can craft a query string to allow the deletion of a product from the products table.
    For convenience, you can continue to use MassiveJS to interface with the database.
    */
   //EXPLANATION

   /*
    A normal input string should look like for example ?name=Dictionary or 'Select * from products where title = 'Dictionary'
    If I add a single quote after the keyword(dictionary) and a semicolon, I can then write another query to be executed after the select
    If I were to use req.params it would not be vulnerable to arbitrary injections.
    My example here is ?name=Dictionary'; Update products set price 0 where id = 1; --
    The --comments out anything after the semicolon.
    The query string is stored in pName and inserts the pName variable, it essentially executes 2 queries as in:
    'Select * from products where title = 'Dictionary'; AND
     Update products set price = 0 Where id = 1;--.
    Anything after the ? in the URL is key value pair,name is the variable name and after the equals(=) is the value
   */
   const pName = req.query.name;
   console.log(pName);

   instance.query(`SELECT * FROM products where title = '${pName}'` ).then(product => res.send(product));


//QUESTION 3

   /*
   Provide two solutions to eliminate the security hole in your approach from the previous section as follows:

    Using a parameterised query
    Using a stored procedure using SQL or PLPGSQL whichever you prefer

    Explicitly show that the injection attack is not now possible for each of your solutions

    Again, you can just use MassiveJS as your database interface library here too.
    */
   //Paramaterized query
   //Found by running 'Localhost:3000/products?name=Baby Book'
   instance.query('SELECT * FROM products where title = $1 order by (price) asc', [`${req.query.name}`]).then(users => res.send(users));

   // Stored Procedure
   db.getproductbytitle(req.query.name).then(items => { res.json(items);});

//QUESTION 4

   /*
   Create a brand new Express project using the Sequelize ORM. Install and configure Sequelize and wire it up to the pgguide database..
    Verify that you have basic connectivity before proceeding.

    Create Sequalize migrations for the pgguide sample database
    Ensure that the appropriate associations and referential integrity checking are set up in your models
    */


//QUESTION 5

   /*
   Use your models and Javascript code to populate the database with some additional test data for all of the models above
   */
  

//QUESTION 6

   /*
   Reimplement the RESTful API using Sequelize and Express for your system. Your API should support the following CRUD operations as follows, 
   returning JSON responses


    GET /products[?name=string]
    List all products
    GET /products/:id
    Show details of the specified products
    POST /products
    Create a new product instance
    PUT /products/:id
    Update an existing product
    DELETE /products/:id
    Remove an existing product


    Show test cases for each of the API endpoint REST operations
   */

});