const express = require('express');
const massive = require('massive');
const http = require('http');
const monitor = require('pg-monitor');
const app = express();
const port = 3000;
var instance;

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'doudou89979'
}).then(instance => {
  app.set('db', instance);
  

 app.get('/products', (req, res) => {
    req.app.get('db').products.find({
          }, {order: [{field: 'price'}]
       }).then(items => {
      res.json(items);
    });
  });

  app.get('/products/:id', (req, res) => {
    req.app.get('db').products.where( 'id IN (SELECT id FROM products WHERE id = ${id})',{id: req.params.id}).then(items => {
      res.json(items);
    });
  });
      
 app.get('/users', (req, res) => {
    req.app.get('db').users.find({
          }, {fields:['email','details'],order: [{field: 'created_at'}]
       }).then(items => {
      res.json(items);
    });
  });
   
  app.get('/users/:id', (req, res) => {
    req.app.get('db').users.where('id IN (SELECT id FROM users WHERE id = ${id})',{id: req.params.id}).then(items => {
      res.json(items);
    });
  }); 
   
  app.get('/purchases', (req, res) => {
   req.app.get('db').query(
	    "select name, address, price, quantity, purchase_items.state from purchases,purchase_items where purchases.id = purchase_items.id order by price asc;"
	  ).then(tests => {
	    res.send(tests);
	  });
  });
   
  http.createServer(app).listen(3000);
});