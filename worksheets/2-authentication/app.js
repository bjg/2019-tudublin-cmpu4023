const express = require('express');
var bodyParser = require('body-parser');
const massive = require('massive');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

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

    app.post('/api/authenticate', (req, res) => {
        res.send(req.body.username + ' ' + req.body.password);
    });

    app.get('/api/products', (req, res) => {
        res.send('Products');
    });
    
    app.listen(port);

});
