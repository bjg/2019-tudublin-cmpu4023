const express = require('express');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
const massive = require('massive');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// verification middleware
function verifyToken(req, res, next) {
    // get auth header value
    const bearerHeader = req.headers['authorization'];

    // check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {

        const bearer = bearerHeader.split(' ');

        const token = bearer[1];

        req.token = token;

        next();

    } else {
        res.status(403).json({
            Status: "Forbidden"
        });
    }
}

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

            // user doesnt exist in the database
            if (users === undefined || users.length == 0) {

                // send back a 404
                res.status('404').json({
                    Status: 'Not found'
                });

            } else {

                const user = users[0];

                // sign and send back the token
                jwt.sign({user: user}, 'secretkey', { expiresIn: '1h' }, (err, token) => {
                    res.json({
                        user_id: user.id,
                        expires: '1h',
                        token: token
                    });
                });

            }

        }); 

    });

    app.get('/api/products', verifyToken, (req, res) => {

        jwt.verify(req.token, 'secretkey', (err, authData) => {

            if(err) {
                res.status(403).json({
                    Status: "Forbidden"
                });
            } else {

                req.app.get('db').query(
                    "SELECT * FROM \"Products\""
                ).then(products => {

                    res.json({
                        authData: authData,
                        products: products
                    });

                })

            }

        });
    });
    
    app.listen(port);

});
