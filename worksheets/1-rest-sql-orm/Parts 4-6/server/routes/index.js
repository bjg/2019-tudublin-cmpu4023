var express = require('express');
var models = require('../models/index');
var router = express.Router();

/* inserts

INSERT INTO users (email, password, details, created_at, deleted_at) values ('test1@gmail.com', 'testpassword', 'sex => M', '2019-02-13T20:36:00.000Z', null);
INSERT INTO users (email, password, details, created_at, deleted_at) values ('test2@gmail.com', 'testpassword2', 'sex => F', '2019-02-13T21:20:00.000Z', null);

INSERT INTO purchases (name, address, state, zipcode, created_at, user_id) values ('Thomas Delaney', 'My House', 'CA', 21451, '2019-02-13T20:50:00.000Z', 51);
INSERT INTO purchases (name, address, state, zipcode, created_at, user_id) values ('Testy McTestFace', 'The Test House', 'FL', 73243, '2019-02-13T21:00:00.000Z', 52);

INSERT INTO products (title, price, tags, created_at, deleted_at) values ('Test Movie', 10.50, '{{"Movie", "Comedy"}}', '2019-02-13T19:50:00.000Z', null);
INSERT INTO products (title, price, tags, created_at, deleted_at) values ('Final Year Project', 6.00, '{{"Movie", "Tragedy"}}', '2019-02-13T15:30:00.000Z', null);

INSERT INTO purchase_items (purchase_id, product_id, price, quantity, state) values (1001, 21, 21.00, 2, 'Delivered');
INSERT INTO purchase_items (purchase_id, product_id, price, quantity, state) values (1002, 22, 30.00, 5, 'Delivered');
*/

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/user', function(req, res) {
  models.user.create({
    email: req.body.email
  }).then(function(user) {
    res.json(user);
  });
});

// get all users
router.get('/users', function(req, res) {
  models.user.findAll({}).then(function(users) {
    res.json(users);
  });
});

// get all products
router.get('/purchases', function(req, res) {
  models.purchase.findAll({}).then(function(purchases) {
    res.json(purchases);
  });
});

// get all products
router.get('/products', function(req, res) {
  if (req.query.name == undefined){
    models.product.findAll({}).then(function(products) {
      res.json(products);
    });
  }
  else{
    models.product.find({
      where: {
       title: req.query.name
      }
    }).then(function(products) {
      res.json(products);
    });
  }
});

router.get('/products/:id', function(req, res) {
  models.product.find({
    where: {
      id: req.params.id
    }
  }).then(function(products) {
      res.json(products);
  });
});

router.post('/products', function(req, res) {
  models.product.create({
    title: req.body.title,
    price: req.body.price,
    created_at: req.body.created_at,
    deleted_at: null,
    tags: req.body.tags
  }).then(function(product) {
    res.json(product);
  });
});

router.put('/products/:id', function(req, res) {
  models.product.find({
    where: {
      id: req.params.id
    }
  }).then(function(product) {
    if(product){
      product.updateAttributes({
        title: req.body.title,
        price: req.body.price,
        created_at: req.body.created_at,
        deleted_at: req.body.deleted_at,
        tags: req.body.tags
      }).then(function(product) {
        res.send(product);
      });
    }
  });
});

router.delete('/products/:id', function(req, res) {

  models.product_item.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(product) {
    res.json(product);
  }).catch(function(error) {
    res.json(error['message']);
  });

  models.product.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(product) {
    res.json(product);
  }).catch(function(error) {
    res.json(error['message']);
  });
});

module.exports = router;
