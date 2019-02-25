const express = require('express');
const massive = require('massive');
const app = express();
const port = 3000;

massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'lab3',
    user: 'postgres',
    password: ''
}).then(instance => {

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.get('/api/authenticate', (req, res) => {
        res.send('Hello World!');
    });

    app.get('/api/products', (req, res) => {
        res.send('Products');
    });
    
    app.listen(port);

});
