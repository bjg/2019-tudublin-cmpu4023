const express = require('express')
const app = express()
const port = 3001;
const models = require('./models')

// models.users.create({
//       id: 51,
//       email: 'victor@dit.ie',
//       password: 'mypass',
//       details: '"sex"=>"M"'
// });
// models.products.create({
//     id: 21,
//     title: 'MacBook Pro',
//     price: '1559.75',
//     tags: ['Technology']
// });
// models.purchases.create({
//     name: 'Andres Schippers',
//     address: '9600 44th Ave. ',
//     state: "CO",
//     zipcode:62899,
//     user_id: 51
// });
// models.purchase_items.create({
//     purchase_id:1003,
//     product_id:21,
//     price: '3000',
//     quantity: 2,
//     state: "Delivered"
// });

//List all products
app.get('/products', (req, response) => {
  var pname = req.query.name;
  models.products.findOne({ where: {title: pname} }).then(p => {
    response.json(p);
  })
});

//Show details of the specified products
app.get('/products/:id', (req, response) => {
  var pid = Number(req.params.id);
  models.products.findOne({ where: {id: pid} }).then(p => {
    response.json(p);
  })
});

//Create a new product instance
//localhost:3001/products?title=Windows 10&price=80&tags=Operating System
app.post('/products', function (req, res) {
  var ptitle = req.query.title;
  var pprice = req.query.price;
  var ptags = [];
  ptags.push(req.query.tags);
  
  models.products.create({
    title: ptitle,
    price: pprice,
    tags: ptags,
  }) 
  res.send('New product: '+ ptitle +' was added.')
 
});

//Update an existing product
//localhost:3001/products/27?price=90
app.put('/products/:id', (req, res) => {
  var pid = Number(req.params.id);
  var new_price = req.query.price;
  models.products.update({
    price: new_price,
  }, {
    where: {
      id: pid
    }
  });
  res.send('Price updated of product with id: '+ pid)
});

//Remove an existing product
//localhost:3001/products/27
app.delete('/products/:id', (req, res) => {
  var pid = Number(req.params.id);
  models.products.destroy({
    where: {
      id: pid
    }
  });
  res.send('Deleted product with id: '+ pid)
});


app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


