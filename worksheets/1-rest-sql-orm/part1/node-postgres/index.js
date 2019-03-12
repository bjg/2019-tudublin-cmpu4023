// C14413458
// Matas Nedzveckas

const express = require('express')
const app = express()
const port = 3000
const massive = require('massive');

massive({
  host: 'localhost',
  database: 'pgguide',
  user: 'me',
  password: 'password',
  port: 5432
}).then(db => {
  
    app.get('/users', (req, res) => {
        //Original
        //db.users.find({}).then(user => res.json(user));

        //List all users email and sex in order of most recently created. Do not include password hash in your output
        db.users.find({}, {fields: ['email','details'],order: [{field: 'created_at', direction: 'asc'}]}).then(user => res.json(user));
    })

        // The challenge with this specific API call was the string domain as I missed the users*/*:id this caused me a lot of pain
    app.get('/users/:id', (req, res) => {
        //Show above details of the specified user
        let id = parseInt(req.params.id)
        console.log((id));
        db.query(
            'SELECT * FROM users where id = $1', [id]
        ).then(user => res.json(user));
    })

    app.get('/products', (req, res) => {
        // List all products in ascending order of price
        db.products.find({}, {order: [{field: 'price', direction: 'asc'}]}).then(product => res.json(product));
    })

    // Easy same as the  users
    app.get('/products/:id', (req, res) => {
        // Show details of the specified products
        let id = parseInt(req.params.id)
        db.query(
            'SELECT * FROM products where id = $1', [id]
        ).then(product => res.json(product));
    })

    // Purchases_items
    app.get('/purchases', (req, res) => {
        db.query(
            'SELECT P.NAME,P.ADDRESS,U.EMAIL,PI.PRICE,PI.QUANTITY,PI.STATE FROM PURCHASE_ITEMS PI JOIN PURCHASES P ON (PI.PURCHASE_ID = P.ID) JOIN PRODUCTS PR ON (PI.PRODUCT_ID = PR.ID) JOIN USERS U ON (P.USER_ID = U.ID) ORDER BY PI.PRICE DESC'
        ).then(product => res.json(product));
    })

    // [?name=string]
    app.get('/productsz', (req, res) => {
        db.query(
            // The bad way
            'select * from products where title LIKE \'' + req.query.name + '\''

            // Pre-pared statement 
            // 'select * from products where title LIKE ${something}',
            // {something: req.query.name}

            // Stored procedure 
            // https://www.tutorialspoint.com/postgresql/postgresql_functions.htm


            // First the function in the databse environment is called product
            // pgguide=# CREATE OR REPLACE FUNCTION ProductFunct()
            // RETURNS setof products AS
            // $BODY$
            // BEGIN
            // RETURN QUERY
            // select * from products;
            // END;
            // $BODY$
            // LANGUAGE plpgsql;
            // 

            // Using the massive interface for the query just like in the previous one combined with a stored procedure
            // 'select * from ProductFunct() where title LIKE ${something}',
            // {something: req.query.name}
            
        ).then(product => res.json(product));
    })

    // To demostrate why this way is bad do the following
    // http://localhost:3000/productsz?name=Dictionary';Select * From users;--
});


app.get('/', (req, res) => {
    res.json({ info: 'Node.js, Express, and Postgres API' })
  })
app.listen(port, () => console.log('Example app listening on port ${port})!'))

// The previous issue with the find was that the user me did not have the permissions required to access any of the tables what I ahd to do is switch to user user
// and grant privilages to user me for all tables