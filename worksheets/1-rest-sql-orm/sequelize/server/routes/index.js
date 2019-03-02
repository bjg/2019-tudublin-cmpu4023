var express = require('express');
var router = express.Router();
var models = require("..\/models\/index.js");
module.exports = router;


// Display Available Endpoints
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
List all products.
CURL COMMAND: curl http://127.0.0.1:3000/products
*/
router.get('/products', (req, res) =>{
  models.products.findAll({})
  .then(products => {
    res.json(products);
  });
});


/* 
Show details of the specified product.
CURL COMMAND: curl http://127.0.0.1:3000/products/:5
*/
router.get('/products/:id', (req, res) =>{
  // parse input to get the user ID value on its own
  console.log("req.params.id = " + req.params.id);
  // get the request parameters
  let id = req.params.id;
  // split on the colon (:)
  let prodID = id.split(':')[1];
  // check output 
  console.log("clean string " + prodID);

  // use clean ID value to get the product from DB
  models.products.find({
    where: {
      id: prodID
    }
  })
  // convert results to JSON for the response 
  .then(items => {
    res.json(items);
  });
});

/*
Create a new product instance
CURL COMMAND: curl --data "title=Doll&price=11.99&tags=Toy&tags=Children" http://127.0.0.1:3000/products
*/
router.post('/products', (req, res) => {
  console.log(req.query.tags);
  var createdAt = new Date();
  models.products.create({
    title: req.body.title,
    price: req.body.price,
    createdAt: createdAt,
    tags: req.body.tags
  })
  .then(user => {
    res.json(user);
  });
});

/*
Update an existing product.
CURL COMMAND: curl -X PUT --data "title=Dictionary&price=22.99&tags=Book&tags=Reference" http://127.0.0.1:3000/products/:1
*/
router.put('/products/:id', (req, res) =>{
  // parse input to get the product ID value on its own
  console.log("req.params.id = " + req.params.id);
  // get the request parameters
  let id = req.params.id;
  // split on the colon (:)
  let prodID = id.split(':')[1];
  // check output 
  console.log("clean string " + prodID);
  models.products.find({
    where: {
      id: prodID
    }
  }).then(products => {
    if(products){
      products.updateAttributes({
        title: req.body.title,
        price: req.body.price,
        tags: req.body.tags
      }).then(products => {
        res.send(products);
      });
    }
  });
});

/*
Remove an existing product.
CURL COMMAND: curl -X DELETE http://127.0.0.1:3000/products/:51
*/
router.delete('/products/:id', (req, res) =>{
  // parse input to get the product ID value on its own
  console.log("req.params.id = " + req.params.id);
  // get the request parameters
  let id = req.params.id;
  // split on the colon (:)
  let prodID = id.split(':')[1];
  // check output 
  console.log("clean string " + prodID);

  // use clean ID value to get the product from DB
  models.products.destroy({
    where: {
      id: prodID
    }
  })
  // convert results to JSON for the response 
  .then(items => {
    res.json(items);
  });
});


