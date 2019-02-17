const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'pgguide',
  user: 'steve',
  password: 'enter6134'
}).then(instance => {
  app.set('db', instance);

  app.get('/', (req, res) => {
      res.send("Hello World");
      
  });

  app.get('/users', (req, res) => {
    instance.query(
        "select email, details from users"
    ).then(users => res.send(users[3]))
  });

  app.get('/users/:id', (req, res) => {
    instance.query(
        "select * from users where id = $1", [req.params.id]
    ).then(users => res.json(users))
  });

  app.get ('/products/:id', (req, res) => {
    instance.query(
        'select * from products where id = $1 order by price asc', [req.params.id]
    ).then(products => res.send(products))
  });

  app.get ('/products', (req, res) => {
    console.log(req.query.title);
    instance.query(
      // using "+ req.query.title" leaves exposed to SQLinjection
      // sqlinjection query in browser http://localhost:3000/products?title=%27Drama%27;select%20*%20from%20users
      "select * from products where title = " + req.query.title
    ).then(products => res.send(products))
  });

  //http://localhost:3000/products/?title=%27Drama%27 to search for drama
  app.get ('/products/:title', (req, res) => {
    var title = req.params.title;
    console.log(title.toString());
    instance.products.find({
      title: req.params.title
    }).then(products => res.send(products))
});

app.get ('/stored', (req,res) => {
  instance.procedure(function(err, products) {
    }).then(products => res.send(products));
  });

  app.get ('/purchases', (req, res) => {
    instance.query(
        "SELECT purchases.name, purchases.address, users.email, purchase_items.price, purchase_items.quantity, purchase_items.state FROM purchases INNER JOIN users ON (purchases.user_id = users.id) INNER JOIN purchase_items ON (purchases.id = purchase_items.purchase_id) ORDER BY purchase_items.price DESC"
    ).then(purchases => res.send(purchases))
  });

  http.createServer(app).listen(3000);
});
