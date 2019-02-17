const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express();

massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'pgguide',
    user: 'postgres',
    password: ''
}).then(instance => {

    app.set('db', instance);

    /* endpoint for all users email and sex */
    app.get('/users', (req, res) => {
        req.app.get('db').users.find(
            {/* find all */ },
            {
                fields: ['email', 'created_at'],
                exprs: {
                    sex: "details::json->>'sex'"
                },
                order: [{
                    field: 'created_at',
                    direction: 'desc'
                }]
            }
        ).then(items => {
            res.json(items);
        });
    });

    /* endpoint for a specific users email and sex */
    app.get('/users/:id', (req, res) => {
        const id = req.params.id;
        req.app.get('db').users.findOne(
            id,
            {
                fields: ['email', 'created_at'],
                exprs: {
                    sex: "details::json->>'sex'"
                },
                order: [{
                    field: 'created_at',
                    direction: 'desc'
                }]
            }
        ).then(items => {
            res.json(items);
        });
    });

    // http://localhost:3000/products?name=;DELETE FROM products WHERE title='Laptop Computer'
    /* endpoint for products in asc order of price */
    app.get('/products', (req, res) => {
        req.app.get('db').products.find(
            {},
            {
                order: [{
                    field: 'price',
                    direction: 'asc'
                }]
            }
        ).then(items => {
            res.json(items);
        });
    });

    /* endpoint for retreiving a specfic product by id */
    app.get('/products/:id', (req, res) => {
        req.app.get('db').products.findOne(
            req.params.id
        ).then(items => {
            res.json(items);
        });
    });

    /* endpoint for purchases */
    app.get('/purchases', (req, res) => {
        req.app.get('db').query(
            "SELECT name, address, email, price, quantity, purchase_items.state \
            FROM purchases \
            INNER JOIN users ON purchases.user_id=users.id \
            INNER JOIN purchase_items on purchases.id=purchase_items.purchase_id \
            ORDER BY price DESC"
        ).then(items => {
            res.json(items);
        });
    });

    http.createServer(app).listen(3000);

});