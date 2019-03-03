const express = require('express')
const products = require('../models/Products')
const users = require('../models/Users')

//Instantiate express router
const router = express.Router();

// Create a test product
router.get('/product', (req, res) =>{
    const product = {
        title: 'Guitar for Drummers',
        price: 9.99
    }
    // Insert into products
    products.create({
        title: product.title,
        price: product.price
    })
    .then(response => {
        console.log(response);
        res.redirect('/api/products');})
    .catch(err => console.log(err));
});

// Create a test user
router.get('/user', (req, res) =>{
    const user = {
        username: 'jamesward',
        password: 'bigpassword'
    }
    // Insert into users
    users.create({
        username: user.username,
        password: user.password
    })
    .then(response => {
        console.log(response);
        res.redirect('/api/users');})
    .catch(err => console.log(err));
});

module.exports = router;