const Sequelize = require('sequelize');
const sequelize = new Sequelize('pgguide', 'erika', '12ambionG', {
    host: 'localhost',
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
});

const models = require('./models/index');
const express = require('express');
const app = express();
const port = 3000;
const Users = require('./models').users;
const Products = require('./models').products;

// Or you can simply use a connection uri
//const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname');

//Check connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

/*
Setting For Part 1
*/

//Get users
app.get('/users', async (req, res) => {
  Users.findAll({ all: true, nested: true }).then(function (users) {
  res.json(users);
})
});

//Get users id
// Get the products by id
app.get('/users/:id', async (req, res) => {
  Users.findOne({
    where: 
    {
      id: req.params.id
    }
  }).then(function (users) {
    res.json(users);
  });
})

//Get products
app.get('/products', async (req, res) => {
    Products.findAll({ all: true, nested: true }).then(function (products) {
      res.json(products);
})
});

//GET /products[?name=string]
app.get('/productss', async (req, res) => {
  Products.findOne({
      where: 
      {
        title: req.query.name
      }
    }).then(function (products) {
      res.json(products);
    }); 
});

// Get the products by id
app.get('/products/:id', async (req, res) => {
  Products.findOne({
    where: 
    {
      id: req.params.id
    }
  }).then(function (products) {
    res.json(products);
  });
})

//

//Get purchases
// app.get('/purchases', async (req, res) => {
//     models.purchases.findAll({ all: true, nested: true }).then(function (purchases) {
//       res.json(purchases);
// })
// });

/*
Setting for the one that was not added
*/

// BodyParser used for postman
app.use(express.urlencoded());

// POST for new product
app.post('/products', async (req, res) => {
  if((req.body.hasOwnProperty('title')&req.body.hasOwnProperty('price')&req.body.hasOwnProperty('tags')))
  {
    //Product is created
    //http://docs.sequelizejs.com/manual/tutorial/instances.html#building-a-non-persistent-instance
    const products = Products.build({
      title: req.body.title,
      price: req.body.price,
      tags: req.body.tags.split(','),
      created_at: new Date(Date.now()).toISOString()
    });
    products.save()
  }
  else
  {
    console.log("Title, Price and Tags are needed")
  }
});

// Update product
app.put('/products/:id', (req, res) => {
  // Find product id
  Products.find({
    where: 
    {
      id: req.params.id
    }
  }).then((product) => {
    if(req.body.hasOwnProperty('title')) {
      product.update({
        title: req.body.title
      })
    }
    if(req.body.hasOwnProperty('price')) {
      product.update({
        price: req.body.price
      })
    }
    if(req.body.hasOwnProperty('tags')) {
      product.update({
        tags: req.body.tags.split(','),
      })
    }
  })
});

//Delete product
app.delete('/products/:id', async (req, res) => 
{
  Products.findOne({
    where: 
    {
      id: req.params.id
    }
  }).then((product) => {
    product.destroy()
  })
});

app.listen(port, () => console.log('Example app listening on port ${port}!'));