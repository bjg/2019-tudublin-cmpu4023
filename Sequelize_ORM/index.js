const express = require('express')
const Sequelize = require('sequelize')
const path = require('path')
const models = require('./models')
const app = express()
var bodyParser = require('body-parser')
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/products', (req, res) => {
  if(req.query.name == null)
  {  
    models.Sequelized_products.findAll().then(product => {
      return res.json(product);
    });
  }
  else
  {
    models.Sequelized_products.findAll({
      where: {
        title: req.query.name
      }
    }).then(product => {
      return res.json(product);
    });
  }
});

app.get('/products/:id', (req, res) => {
  models.Sequelized_products.findAll({
    where: {
      id: req.params.id
    }
  }).then(product => {
    return res.json(product);
  });
});

app.post('/products', (req, res) => {
  const { title, price, tag } = req.body;

  models.Sequelized_products.max('id').then(result => {
    if(title == null || price == null || tag == null)
    {
      console.log("Null value, retry")
    }
    else
    {
      models.Sequelized_products.create({
        id: result + 1,
        title: title,
        price: price,
        created_at: new Date(),
        deleted_at: new Date(),
        tags: [tag]
      });
    }
  })  
});

app.put('/products/:id', (req, res) => {
  var prodID = req.params.id; 
  
  models.Sequelized_products.findOne({
    where: { id: prodID }
  }).then( resultValue => {
    resultValue.updateAttributes({
      price: "80.50"
    });
  });  
});


app.delete('/products/:id', (req, res) => {
  var prodID = req.params.id; 
  
  models.Sequelized_products.destroy({
    where: {id: prodID}
  });
});

