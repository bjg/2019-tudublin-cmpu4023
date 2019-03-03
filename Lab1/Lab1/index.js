const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'pgguide',
  user: 'Thomas',
  password: 'cronin98'
}).then(instance => {
  app.set('db', instance);
  
  //To get all users email and details
  app.get('/users', (req, res) => {
    req.app.get('db').users.db.query(
  "select email,details from users ORDER BY created_at desc;"
	).then(items => {
      res.json(items);
    });
  });
  
  //https://github.com/dmfay/massive-js/issues/69
  //To get a specific user using id 
  app.get('/users/:id', (req, res) => {
    req.app.get('db').users.db.query(
  "select id,email,details from users where id = "+"'"+req.params.id+"'"
	).then(items => {
      res.json(items);
    });
  });
  
  //To get all products (ascending order)
  app.get('/products', (req, res) => {
    req.app.get('db').products.find({
    }, {
      order: [{field: 'price', direction: 'asc'}]
    }).then(items => {
      res.json(items);
    });
  });
  
  /*
  app.get('/purchase_items', (req, res) => {
    req.app.get('db').purchase_items.find({
    }, {
      order: [{field: 'price', direction: 'asc'}]
    }).then(items => {
      res.json(items);
    });
  });
  */

  //Get the product with a specific id
  app.get('/products/:id', (req, res) => {
    req.app.get('db').products.db.query(
  "select * from products where id = " + req.params.id
	).then(items => {
      res.json(items);
    });
  });
  
  //To list the receivers name, address, purchasers email address, price, quantity, delivery status. Ordered by price in descending order
  app.get('/purchases', (req, res) => {
    req.app.get('db').query(
  "select purchases.name, users.email, purchases.address, purchase_items.price, purchase_items.quantity, purchase_items.state from purchases join users on purchases.user_id = users.id join purchase_items on purchases.id = purchase_items.purchase_id ORDER BY purchase_items.price desc"
	).then(items => {
      res.json(items);
    });
  });
  
  
  //O tried to delete a product from the product table but i was unsuccessful, i tried these two ways
  //Dictionary; DELETE FROM products WHERE title = "Dictionary"
  //x'; DELETE FROM products WHERE title = "Dictionary"; --
  
  
  //SQL injection 
  //(http://127.0.0.1:3000/product/anything' OR 'x'='x) Searching that will bring results fro all the producst
  /*
  app.get('/product/:name', (req, res) => {
    req.app.get('db').products.db.query(
  "select * from products where title = "+"'"+req.params.name+"'"
	).then(items => {
      res.json(items);
    });
  });
  */
  
  
  /*
  //Part 3 to fix injection using parameterised query (works)
  app.get('/product/:name', (req, res) => {
    req.app.get('db').products.findOne({
	title : req.params.name
    }, {
      order: [{field: 'price', direction: 'asc'}]
    }).then(items => {
      res.json(items);
    });
  });
  */
  
  //To stop sql injection using stored procedure
  app.get('/product/:name', (req, res) => {
    req.app.get('db').queries.preparedStatement(
    req.params.name
	).then(items => {
      res.json(items);
    });
  });
  

  http.createServer(app).listen(3000);
});