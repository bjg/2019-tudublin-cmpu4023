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

    app.set('db', instance);

    // authentication endpoint
    app.post('/api/login', (req, res) => {

        req.app.get('db').query (
            "SELECT id, username \
             FROM \"Users\" \
             WHERE username = ${username} \
             AND password = crypt(${password}, password);",
            {
                username: req.body.username,
                password: req.body.password
            }
        ).then(users => {

            res.send("works");

        }); 

    });

    app.get('/api/products', (req, res) => {

    });
    
    app.listen(port);

});
