const express = require('express');
const path = require('path');
const massive = require('massive');

// Initialize express app
const app = express();

// Load the pug View
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Initialize the massive DB connection
massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'postgres',
    password: 'Ibanezrg320dx',
}).then(db => {

    //Home Url Route
    app.get('/', function(req, res){
        res.render('index', {
            title:'Home Page'
        });
    });

    //Get All Users
    app.get('/users', function(req, res){
        db.query('SELECT email, details FROM users ORDER BY created_at').then (result => {
            res.send(result)
        });
    });

    //Get User by id
    app.get('/users/:id', function(req, res){
        db.users.findOne({id: req.params.id}, {fields: ['email', 'details']})
        .then (result => {
            res.send(result)
        });
    });

    //Get Product by id
    app.get('/products/:id', function(req, res){
        db.products.findOne({id: req.params.id})
        .then (result => {
            res.send(result)
        });
    });

    //Get Product by name or all price ascending
    app.get('/products', function(req, res){
        // Paramaterized Approach to Solving Security Hole
        if (req.query.name) {
            db.products.findOne({title: req.query.name})
            .then (result => {
                res.send(result)
            });
        }
        else
            db.query('SELECT * FROM products ORDER BY price').then (result => {
                        res.send(result)
            });
    });

    // Stored Procedure Approach to Solving Security Hole
    app.get('/storedprocedure', function(req, res){
        console.log(req.query.name);
        db.query('select searchproduct(${name})', {name: req.query.name})
        .then (result => {
            res.send(result)
        });
    });

    // Poorly Implemented Search Suseptible to SQL injection
    app.get('/sqlinjection', function(req, res){
        db.query('select * from products where id = ' + req.query.id)
        .then (result => {
            res.send(result)
        });
    });

    //Get Purchases
    app.get('/purchases', function(req, res){
        db.query(`SELECT products.title, purchases.name, purchases.address, users.email, 
        purchase_items.price, purchase_items.quantity, purchase_items.state 
        FROM purchases 
        INNER JOIN users on purchases.user_id = users.id
        INNER JOIN purchase_items on purchase_items.purchase_id = purchases.id
        INNER JOIN products on purchase_items.product_id = products.id
        ORDER BY purchase_items.price DESC`)
        .then (result => {
            res.send(result)
        });
    });

});

//Start the app
app.listen('3000', function(){
    console.log('server started on port 3000...');
});


