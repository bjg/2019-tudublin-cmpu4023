const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'devops'
}).then(instance => {
  app.set('pgguide', instance);

  //GET users

  app.get('/users', (req, res) => {
    req.app.get('pgguide').users.find({}, {
    fields: ['email','details',],
    order: [
      {field: "created_at", direction: "desc"},
      
    ]
}).then(users => { res.json(users);
});
  });

//get users by id
    app.get('/users/:id', (req, res) => {
     req.app.get('pgguide').users.find(req.params.id
      ).then(user => { res.json(user);
 
});
  });

//get products
  app.get('/products', (req, res) => {
    req.app.get('pgguide').products.find({}, {
      fields: ['id','title','price','tags'],
      order: [
        {field: "price", direction: "desc"},
        
      ]
    }).then(user => { res.json(user);
  // all tests matching the criteria
});
  });


  //get products by id
  app.get('/productsid/:id', (req, res) => {
    req.app.get('pgguide').products.find(req.params.id
    ).then(user => { res.json(user);
 
});
  });
//get products by name
  app.get('/getproducts/:name', (req, res) => {
    req.app.get('pgguide').products.find(req.params.name
    ).then(user => { res.json(user);
 
});
  });

 // get purchases

  app.get('/purchases', (req, res) => {
  req.app.get('pgguide').query(
 'select products.title, purchases.name, \
  purchases.address,users.email,purchase_items.price,\
  purchase_items.quantity,purchase_items.state\
  from  purchases inner join \
  users on purchases.user_id = user_id \
  inner join purchase_items on purchase_items.purchase_id = purchase_id inner join\
  products on purchase_items.product_id = product_id'

).then(user => { res.send(200).json(user);
  // all tests matching the criteria
});
  });

 

  http.createServer(app).listen(3000);
  console.log(`Test app listening on port 3000!`)
});

