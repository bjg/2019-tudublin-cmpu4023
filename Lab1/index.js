const express = require('express');
const http = require('http');
const massive = require('massive');
//const pgsp = require('pg-stored-procedure');

const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'test1234',
  enhancedFunctions: true
}).then(instance => {
  app.set('db', instance);

  app.get('/', (req, res) => {
      res.send("GARY TESTING HAPPY LIFE KMS :(");
  });


  /*

  GET /users

  */
  app.get('/users', (req, res) => {
    instance.query(
        "select email, details from users ORDER BY created_at ASC"
    ).then(users => res.send(users))
  });

  /*

  GET /users/:id

  */
  app.get('/users/:id', (req, res) => {
    instance.query(
        "SELECT * FROM users WHERE id = $1", [req.params.id]
    ).then(users => res.send(users))
  });

  /*

  GET /products ASC by price

  */
  app.get ('/products', (req, res) => {
    instance.query(
        "SELECT * FROM products ORDER BY products.price ASC;"
    ).then(products => res.send(products))
  });

  /*

  GET /products/id

  */
  app.get ('/products/:id', (req, res) => {
    instance.query(
        "SELECT * FROM products WHERE id = $1", [req.params.id]
    ).then(products => res.send(products))
  });

  /*

  GET /purchases Listing details from joining tables in desc order

  */
  app.get ('/purchases', (req, res) => {
    instance.query(
        "SELECT purchases.name, purchases.address, users.email, purchase_items.price, purchase_items.quantity, purchase_items.state FROM purchases INNER JOIN users ON (purchases.user_id = users.id) INNER JOIN purchase_items ON (purchases.id = purchase_items.purchase_id) ORDER BY purchase_items.price DESC"
    ).then(purchases => res.send(purchases))
  });


  //SQL INJECTION
   app.get ('/inject/:title', (req, res) => {
     instance.query(
       // use in browser http://127.0.0.1:3000/inject/'Drama'; DELETE FROM products WHERE id = 54;
       // use in browser http://127.0.0.1:3000/inject/'Drama'; SELECT * FROM users;
       // using "+ req.query.title" leaves query susceptible to injection attack
       "select * from products where title = " + req.params.title
     ).then(products => res.send(products))
  });


  //One way to counter the sql injection
   app.get ('/test/:title', (req, res) => {
     instance.products.find({
       title: req.params.title
     }).then(products => res.send(products))
   });

  /*

  Stored Procedure Method, Second way to counter SQL INJECTION
  //instance.authenticate('Evelyn.Patnode@gmail.com', '029761dd44fec0b14825843ad0dfface')

  */
  app.get ('/help', (req,res) => {
  instance.storedprocedure(function(err, products) {
    }).then(products => res.send(products));
  });


  http.createServer(app).listen(3000,()=>{
      console.log("App is listening on http://127.0.0.1:3000");
  });
});
