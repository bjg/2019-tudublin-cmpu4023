const express = require('express')
const products = require('../models/Products')
const users = require('../models/Users')
const purchases = require('../models/Purchases')
const purchase_items = require('../models/Purchase_Items')

//Instantiate express router
const router = express.Router();

// Create a test product
router.get('/product', (req, res) =>{
    const product = {
        title: 'Guitar for Drummers',
        price: 999.99,
        tags: '{Book}'
    }

    // Insert into products
    products.create({
        title: product.title,
        price: product.price,
        tags: product.tags
    })
    .then(response => {
        console.log(response);
        res.redirect('/api/products');})
    .catch(err => console.log(err));
});

// Create a test user
router.get('/user', (req, res) =>{
    const user = {
        email: 'jamesward@hotmail.com',
        password: '029761dd44fec0b14kdhf73ks0dfface',
        details: {sex: "M"}
    }

    // Insert into users
    users.create({
        email: user.email,
        password: user.password,
        details: user.details
    })
    .then(response => {
        console.log(response);
        res.redirect('/api/users');})
    .catch(err => console.log(err));
});

// Create a test purchase
router.get('/purchase', (req, res) =>{
    const purchase = {
        name: 'George Harrison',
        address: '691 Fake St.',
        state: 'FL',
        zipcode: 50381,
        user_id: 40
    }

    // Insert into purchases
    purchases.create({
        name: purchase.name,
        address: purchase.address,
        state: purchase.state,
        zipcode: purchase.zipcode,
        user_id: purchase.user_id
    })
    .then(response => {
        console.log(response);
        res.redirect('/api/purchases');})
    .catch(err => console.log(err));
});

// Create a test purchase item
router.get('/purchaseitem', (req, res) =>{
    const purchase_item = {
        purchase_id: 1000,
        product_id: 11,
        price: 9.99,
        quantity: 1,
        state: 'Pending'
    }

    // Insert into purchase_item
    purchase_items.create({
        purchase_id: purchase_item.purchase_id,
        product_id: purchase_item.product_id,
        price: purchase_item.price,
        quantity: purchase_item.quantity,
        state: purchase_item.state
    })
    .then(response => {
        console.log(response);
        res.redirect('/api/purchase_items');})
    .catch(err => console.log(err));
});

module.exports = router;