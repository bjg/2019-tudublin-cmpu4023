var express = require('express');
var router = express.Router();
var models = require('../models/index');

//find all products
router.get('/products', function(req, res) {
  models.productss.findAll({}).then(function(products) {
    res.json(productss);
  });
});

//Show details of a specified product
router.get('/products/:id', function(req, res) {
  models.products.findOne({ id: req.params.id })
  .then(function(products) {
    res.json(products);
  });
});

//add a new product
router.post('/products', function(req, res) {
  models.products.create({
    title: req.body.title,
    price: req.body.price,
	tags: req.body.tag
  }).then(function(products) {
    res.json(products);
  });
});

//Update an existing product
router.put('/products/:id', function(req, res) {
  models.products.find({
    where: {
      id: req.params.id
    }
  }).then(function(products) {
    if(products){
      products.updateAttributes({
        title: req.body.title,
		price: req.body.price,
		tags: req.body.tag
      }).then(function(products) {
        res.send(products);
      });
    }
  });
});

//Remove an existing product
router.delete('/products/:id', function(req, res) {
  models.products.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(products) {
    res.json(products);
  });
});