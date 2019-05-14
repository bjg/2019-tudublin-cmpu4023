const express = require('express')
const db = require('../config/database')
const products = require('../models/Products')
const users = require('../models/Users')
const purchases = require('../models/Purchases')
const purchase_items = require('../models/Purchase_Items')

//Instantiate express router
const router = express.Router();

// Get get product by name or all products price ascending
router.get('/products', (req, res) => {
    if (req.query.name){
        products.findAll({
            where: {
                title: req.query.name                          
            }
        }).then(response => {
            console.log('response = ' + response);
            res.send(response);
        })
        .catch(err => console.log(err))
    }
    else {
        products.findAll({
            order: [[ 'price', 'ASC']]
        }).then(response => {
            console.log('response = ' + response);
            res.send(response);
        })
        .catch(err => console.log(err))
    }
});

// Get product by id
router.get('/products/:id', (req, res) => {
    products.findAll({
        where: {
            id: req.params.id                          
        }
    }).then(response => {
        console.log('response = ' + response);
        res.send(response);
    })
    .catch(err => console.log(err))
});

// Create new product
router.post('/create_product', (req, res) =>{
    let {title, price, tags} = req.body;
    let errors = [];

    // Validate fields
    if(!title){
        errors.push({ text: "Please add a title"});
    }
    if(!price){
        errors.push({ text: "Please add a price"});
    }
    if(!tags){
        errors.push({ text: "Please add a tag"});
    }

    // Check for errors
    if(errors.length > 0) {
        res.render('add', {
            errors,
            title,
            price,
            tags
        })
    }
    else{
        // Insert into products
        products.create({
            title,
            price,
            tags
        })
        .then(response => {
            console.log(response);
            res.redirect('/api/products?name=' + req.query.name);})
        .catch(err => console.log(err));
    }
});

// Update product
router.put('/update_product', (req, res) =>{
    let {id, title, price, tags} = req.body
    let errors = [];

    // Validate fields
    if(!id){
        errors.push({ id: "Please add an id"});
    }
    if(!title){
        errors.push({ text: "Please add a title"});
    }
    if(!price){
        errors.push({ text: "Please add a price"});
    }
    if(!tags){
        errors.push({ text: "Please add a tag"});
    }

    // Check for errors
    if(errors.length > 0) {
        res.render('add', {
            errors,
            id,
            title,
            price,
            tags
        })
    }
    else{
        // Update product
        products.update({
            title,
            price,
            tags
        }, {where: { id: id }})
        .then(response => {
            console.log(response);
            res.redirect('/api/products?name=' + req.query.title);})
        .catch(err => console.log(err));
    }
});

// Delete product by id
router.delete('/deleteproduct/:id', (req, res) => {
    products.destroy({
        where: {
            id: req.params.id                          
        }
    }).then(response => {
        console.log(response + '/nStatus 200, removed product with ID = ' + req.params.id);
        res.redirect('/api/products');
    })
    .catch(err => console.log(err))
});

// Get all users
router.get('/users', (req, res) =>
    users.findAll({
        attributes: ['email', 'details']
    }).then(response => {
        console.log('response = ' + response);
        res.send(response);
    })
    .catch(err => console.log(err))
);

// Get all purchases
router.get('/purchases', (req, res) =>
    purchases.findAll({
        attributes: ['id', 'name', 'address', 'state', 'zipcode', 'user_id']
    }).then(response => {
        console.log('response = ' + response);
        res.send(response);
    })
    .catch(err => console.log(err))
);

// Get all purchase_items
router.get('/purchase_items', (req, res) =>
    purchase_items.findAll().then(response => {
        console.log('response = ' + response);
        res.send(response);
    })
    .catch(err => console.log(err))
);

module.exports = router;