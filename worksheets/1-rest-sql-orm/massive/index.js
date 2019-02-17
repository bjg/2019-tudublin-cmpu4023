const express = require('express');
const app = express();
const port = 3000;
const massive = require('massive');
const monitor = require('pg-monitor');

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

massive('postgres://localhost:5432/pgguide').then(db => {
     monitor.attach(db.driverConfig);


   // // //PART 1
    app.get('/users', function(req, res) {
        db.query('SELECT email, details, created_at FROM users ORDER BY created_at DESC')
            .then(data => {
                res.send(data)


        });
    });

    // ///PART 2
    app.get('/users/:id', function(req, res) {
        db.query('SELECT email, details, created_at FROM users WHERE id=' + req.params.id).then(data => {
            res.send(data)
        });
    });


    // ///PART 3
    app.get('/products', function(req, res){
        db.query('SELECT title, price FROM products ORDER BY price ASC').then(data => {
                res.send(data)
        });
    });


    // ///PART 4
    app.get('/products/:id', function(req, res) {
        db.query('SELECT title, price FROM products WHERE id=' + req.params.id).then(data => {
            res.send(data)
        });
    });

    // //PART 5
    app.get('/purchases', function(req, res){
        db.query('select purchase_items.price, purchase_items.quantity, purchase_items.state, purchases.name AS RECEIVER_NAME, purchases.address AS RECEIVER_ADDRESS, users.email AS PURCHASERS_EMAIL from purchase_items ' +
            'INNER JOIN PURCHASES ON (purchase_items.purchase_id=purchases.id) ' +
            'INNER JOIN USERS ON (purchases.user_id=users.id) ORDER BY price DESC').then(data => {
            res.send(data)
        });
    });

    //PART 6 SQL INJECT BADLY
    app.get('/products_sqlinject', function(req, res){
           db.query('SELECT * FROM products WHERE title = '+req.query.name ).then(data => {
               res.json(data)
           })
    });

    //PART 7 PARAMETERISED QUERY
    app.get('/products_parameterised', function(req, res){
           db.query('SELECT title, price FROM products WHERE title =' + req.query.name ).then(data => {
               res.json(data)
           })

    });

    //PART 8 STORED PROCEDURE USING SQL
    app.get('/productssql', (req, res) => {
    
            db.query('Select * From sqlProduct( \'' + req.query.name + '\');').then(data => {
                res.json(data)
            })

    });


});

