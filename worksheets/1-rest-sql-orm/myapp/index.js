const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'just2Brothers'
}).then(instance => {
  app.set('db', instance);

  app.get('/', (req, res) => {
      res.send("Lab 1 Enterprise Application Develpment");
  });

  app.get('/users', (req, res) => {
    instance.query(
        "select email, details from users order by created_at desc"
    ).then(users => res.send(users))
  });

  app.get('/users/:id', (req, res) => {
    instance.query(
        "select * from users where id = $1", [req.params.id]
    ).then(users => res.send(users))
  });

  // app.get ('/products', (req, res) => {
  //   instance.query(
  //       "select * from products"
  //   ).then(products => res.send(products))
  // });

  app.get ('/products/:id', (req, res) => {
    instance.query(
        "select * from products where id = $1", [req.params.id]
    ).then(products => res.send(products))
  });

  app.get ('/purchases/', (req, res) => {
    var query = "select purchases.name, purchases.address, users.email, purchase_items.price, purchase_items.quantity, purchase_items.state\
    from purchases\
    inner join users on (purchases.user_id = users.id)\
    inner join purchase_items ON (purchases.id = purchase_items.purchase_id)\
    order by purchase_items.price DESC";
    instance.query(
        query
    ).then(purchases => res.send(purchases))
  });

  //Part 2:
  app.get ('/products', (req, res) => {
    if (req.query.title != null) {
      instance.query(
        "select * from products where title = " + req.query.title
      ).then(products => res.send(products))
    }
    else {
      instance.query(
        "select * from products"
      ).then(products => res.send(products))
    }
  });

  http.createServer(app).listen(3000);
});