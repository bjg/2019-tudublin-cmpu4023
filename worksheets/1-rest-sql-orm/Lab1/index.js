const express = require('express');
const massive = require('massive');
const port = 3000;
const app = express();

massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'pgguide',
    user: 'Dano',
    password: '123'
}).then(instance => {
    app.set('db', instance);

    app.get('/', (req, res) => {
            res.json('Hello World!');
    });

    //Get all users
    app.get('/users', (req, res) => {
        req.app.get('db').users.find({
        }, {
            fields: ['id', 'email', 'details'],
            order: [{field: 'created_at', direction: 'desc'}]
        }).then(users => {
            res.json(users);

        });
    });

    //Get user by ID
    app.get('/users/:id', (req, res) => {
        req.app.get('db').users.find({
            id: req.params.id,
        }, {
            fields: ['id', 'email', 'details'],
        }).then(users => {
            res.json(users);

        });
    });

    //Get all products
    app.get('/products', (req, res) => {
        if(req.query.name) {
            //Bad query
            //Example of SQL injection to get user info
            //http://localhost:3000/products?name=';SELECT * FROM users WHERE ID=17 or email like '
            /*
            req.app.get('db').query(
                "SELECT * FROM Products WHERE title LIKE '" + req.query.name + "'",
            ).then(products => {
                res.json(products);

            });
            */

            //Parametrised query
            req.app.get('db').products.find({
                title:req.query.name,
            }).then(products => {
                res.json(products);

            });
        }
        else{
            req.app.get('db').products.find({
            }, {
                order: [{field: 'price', direction: 'asc'}]
            }).then(products => {
                res.json(products);

            });
        }
    });

    //Get product by id
    app.get('/products/:id', (req, res) => {
        req.app.get('db').products.find({
            id: req.params.id,
        }, {
            order: [{field: 'price', direction: 'asc'}]
        }).then(products => {
            res.json(products);

        });
    });

    //Get purchases
    app.get('/purchases', (req, res) => {
            req.app.get('db').query(
                'SELECT purchases.id, purchases.name AS ReceiverName, purchases.address AS ReceiverAddress, users.email AS PurchaserEmail, purchase_items.price, ' +
                'purchase_items.quantity, purchase_items.state FROM purchase_items ' +
                'INNER JOIN PURCHASES ON (purchase_items.purchase_id = purchases.id) ' +
                'INNER JOIN USERS ON (purchases.user_id = users.id) ' +
                'ORDER BY price ASC',
            ).then(purchases => {
        res.json(purchases);
            });
    });
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});