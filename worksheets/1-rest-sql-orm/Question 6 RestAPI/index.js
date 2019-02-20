var express = require('express')
var app = express();

var Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres://postgres:123456@localhost:5432/pgguide');

const models = require("./models");

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));


// GET List all products for testing to make sure the data is dsiplaying  
app.get('/products', function(req, res) {
  models.products.findAll({}).then(function(products) {
    res.json(products);
  });
});


// GET /products[?name=string]
app.get('/products', function (req, res) {
sequelize.query(`select * from products where title='${req.query.name}'`).then(data => {
res.json(data);
})
})


// GET /products/:id
app.get('/products/:id', function(req, res) {
  models.products.find({
    where: {
      id: req.params.id
    }
  }).then(function(products) {
    res.json(products);
  });
});


// POST products
app.post('/products', function(req, res) {
  models.products.create({   
    "title" : "stuff",
    "price" : 10.5,
    "created_at" : "2019-02-10T20:00:00.000Z",
    "deleted_at" : null,
    "tags": Array['{"Book","code"}']
  }).then(function(products) {
    res.json(products);
  });
});

//  PUT products/:id
app.put('/products/:id', function(req, res) {
models.products.find({
where: {
id: req.params.id
}
}).then(function(resp) {
if(resp){
resp.updateAttributes({
"title" : "T",
"price" : 12.55,
"created_at" : "2019-02-15T20:00:00.000Z",
"deleted_at" : null,
"tags": Array['{"Book","data"}']

  }).then(function(products) {
    res.send(products);
  });
}
});
});


// delete  product
app.delete('/products/:id', function(req, res) {
models.products.destroy({
where: {
id: req.params.id
}
}).then(function(products) {
res.json(products);
});
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})


