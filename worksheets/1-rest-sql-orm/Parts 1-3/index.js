const express = require('express');
const app = express();
const port = 3000;
const massive = require('massive');
const http = require('http');
var db;

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'thomas',
  password: 'Password',
  ssl: false,
  poolSize: 10,
}).then(instance => {
  db = instance;
});

app.get('/users', (req, res) => {
  db.users.find({}, {
    fields: [
      "email",
      "details::json"
    ],
    order: [
      {
        field: 'created_at',
        direction: 'desc',
      }
    ]
  }).then(items => {
    let info = [];

    items.forEach(function(entry) {
      if (entry['details'] != null){
        info.push({
          "email": entry['email'],
          "sex": entry['details']['sex']
        });
      }
      else {
        info.push({
          "email": entry['email'],
          "sex": "Not Discolsed"
        });
      }
    });

    res.json(info);
  });
});

app.get('/users/:id', (req, res) => {
  db.users.find({
    id: req.params.id
  },{
    fields: [
      "email",
      "details::json"
    ],
    order: [
      {
        field: 'created_at',
        direction: 'desc',
      }
    ]
  }).then(items => {
    let info = [];

    items.forEach(function(entry) {
      if (entry['details'] != null){
        info.push({
          "email": entry['email'],
          "sex": entry['details']['sex']
        });
      }
      else {
        info.push({
          "email": entry['email'],
          "sex": "Not Discolsed"
        });
      }
    });

    res.json(info);
  });
});

app.get('/products/:id', (req, res) => {
  db.products.find({
    id: req.params.id
  }).then(items => {
    res.json(items);
  });
});
/*
     //unsafe query
    const q2 = "select * from products where title = '" + req.query.name + "'";

    //SQL injetion to delete product row
  
    //Dictionary';DELETE from purchase_items where product_id = (select id from products where title = 'Coloring Book'); DELETE from products where title = 'Coloring Book';--

    q2

    //paramererized query
    const q = "select * from products where title = $1";
    //q, [req.query.name]

    //unsafe query
    const q2 = "select * from products where title = '" + req.query.name + "'";

    //stored procedure 
    db.getproductbytitle(req.query.name).then(items => {
      res.json(items);
    }).catch(error => {
      console.log(error);
    });
*/

app.get('/products', (req, res) => {

  if (req.query.name == undefined) {
    db.products.find({},{
      order: [
        {
          field: 'price',
          direction: 'asc',
        }
      ]
    }).then(items => {
      res.json(items);
    });
  }
  else {
  
   db.getproductbytitle(req.query.name).then(items => {
      res.json(items);
    }).catch(error => {
      console.log(error);
    });
  }
});

app.get('/purchases', (req, res) => {
  db.query(
    "select name, address, email, price, quantity FROM purchases P JOIN users U on (P.user_id = U.id) join purchase_items on (purchase_id = P.id) order by price desc;"
  ).then(items => {
    res.json(items);
  });
});

app.get('/', (req, res) => res.send('Hello World!'));


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
