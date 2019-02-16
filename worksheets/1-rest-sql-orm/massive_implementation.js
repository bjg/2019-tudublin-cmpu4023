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
            {/* find all */},
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

    /* endpoint for products in asc order of price */
    app.get('/products', (req, res) => {
        req.app.get('db').products.find(
            {/* find all */},
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
        const id = req.params.id;
        req.app.get('db').products.findOne(
            id
        ).then(items => {
            res.json(items);
        });
    });

    app.get('/purchases', (req, res) => {
        req.app.get('db').purchases.find({
        }).then(items => {
            res.json(items);
        });
    });

    http.createServer(app).listen(3000);

});