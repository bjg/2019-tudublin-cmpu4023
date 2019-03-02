var models = require('../models/index.js');

exports.findAll = (req, res) => {
    models.products.findAll({

    }).then(products => {
        res.send( products );
    });
};

exports.findOne = (req, res) => {
    models.products.find({
        where: {
      id: req.params.id
    }
    }).then(products => {
        res.send( products );
    });
};

exports.create = (req, res) => {
    models.products.create({
        title: req.body.title,
        price: req.body.price,
        created_at: req.body.created_at,
        deleted_at: req.body.deleted_at,
        tags: req.body.tags,
    }).then(function(products) {
        res.json(products);
    });
};

exports.update = (req, res) => {
    models.products.find({
    where: {
      id: req.params.id
    }
    }).then(function(products) {
    if(products){
      products.updateAttributes({
        title: req.body.title,
        price: req.body.price,
        created_at: req.body.created_at,
        deleted_at: req.body.deleted_at,
        tags: req.body.tags,
      }).then(function(products) {
        res.send(products);
      });
    }
    });
};

exports.delete = (req, res) => {
    models.products.destroy({
        where: {
      id: req.params.id
    }
    }).then(function(products) {
        console.log(products);
        res.send(JSON.stringify( products, null, 2 ));
    });
};