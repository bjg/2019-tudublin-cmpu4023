var express = require('express');
var app = express();
var massive = require("massive");
const port = 3000;

massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'davidoneill',
    password: 'hello',
    ssl: false,
    poolSize: 10,
}).then(db => {

    app.get('/', function(req, res) {
        res.send('Return JSON or HTML View');
    });

    // Q1.1 - GET /users
    app.get('/users', (req, res) => {
        db.query("Select email, details -> 'sex' from users order by created_at desc").then(users => {
            res.send(users);
        });
    });


    // Q1.2 - GET /users/:id
    app.get('/users::id', function(req, res) {
        let id = req.params.id;
        db.query("Select email, details -> 'sex' from users where id = " + id).then(users => {
            res.send(users);
        });
    });



    // Q1.3 - GET /products
    app.get('/products', function(req, res) {
        db.query("Select * from products order by price asc").then(products => {
            res.send(products);
        });
    });

    // Q1.4- GET /products/:id
    app.get('/products::id', function(req, res) {
        let id = req.params.id;
        db.query("Select * from products where id = " + id).then(products => {
            res.send(products);
        });
    });


    // Q1.5 - GET /purchases
    app.get('/purchases', function(req, res) {
        db.query("Select name, address, email, price, quantity, pur.state from purchases purc join purchase_items pur on pur.purchase_id = purc.id inner join users on purc.user_id = users.id order by price desc ").then(purchases => {
            res.send(purchases);
        });
    });


    //Q2 GET /product[?name=string]
    app.get('/products', function(req, res) {
        var query = req.query.title;
        db.query('Select * from products where title = ' + query).then(products => {
            res.send(products);
        });
    });
    // **SQL Injection that was used is stated in the Lab Write Up Document.**

    //Q3 Parametised Querie
    app.get('/products', function(req, res) {
        var query = req.query.title;
        db.query('Select * from products where title = $1', [req.query.title]).then(products => {
            res.send(products);
        });
    });


});

app.listen(port, () => console.log('Example app listening on port ${port}!'))