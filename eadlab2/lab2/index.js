const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const port = 3000
const massive = require('massive');
const jwt = require('jsonwebtoken');
const config = require('./config.js');
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
massive({
    host: 'localhost',
    port: 5432,
    database: 'ead2',
    user: 'davidoneill',
    password: 'hello'
}).then(instance => {
    app.set('db', instance)
        //  Q1
    app.get('/', (request, response) => {
            response.json({ info: 'This is a JWT API' })
        })
        // This website has a good tutorial on authorising a table with credentials: https://tinyurl.com/y4utgzxg
    app.post('/users', (req, res) => {
        let query
        query = req.app.get('db').createUser([req.query.username, req.query.password],
            function(err, result) { if (err) { return next(err); } });
        return query.then(username => res.json(username))
    });


    app.post('/products', (req, res) => {
        let query
        query = req.app.get('db').authUser([req.body.username, req.body.password],
            function(err, result) { if (err) { return next(err); } });
        query.then(username => {
            if (username === undefined) {
                return res.status(401).send('INVALID')
            } else {
                req.app.get('db').products.find({}, {}).then(products => {
                    res.json(products);
                });
            }
        })
    });

    // Q.2
    app.post("/login", (req, res) => {
        let query
        query = req.app.get('db').authUser([req.body.username, req.body.password],
            function(err, result) { if (err) { return next(err) } })
        query.then(username => {
            if (username = undefined) {
                return res.status(401).send('INVALID')
            } else {
                var token = jwt.sign({ username: req.query.username }, config.secret, { expiresIn: "20h" })
                res.status(200).json({
                    message: "Authorised",
                    username: req.query.username,
                    expiresIn: "20h",
                    token
                })
            }
        })

    })

    function authenticate(req, res, next) {
        var bearerHeader = req.header["authorization"]
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split("")
            const BearerToken = bearer[1]

            jwt.verify(BearerToken, config.secret, function(err, decoded) {
                if (!err) {
                    console.log("Success")
                    next()
                } else {
                    res.status(401).send("Authentication failed")
                }
            })
        }
    }

    app.post("/products/", authenticate, (req, res) => {
        req.app.get('db').products.find({}, {}).then(products => {
            res.sendStatus(200).json(products)
        })
    })
    app.post("/users", authenticate, (req, res) => {
        req.app.get('db').users.find({}, {}).then(users => {
            res.sendStatus(200).json(users)
        })
    })
});

/* Q.3 is in my writeup pdf file. I completed it through SQL
CREATE TABLE users(
ead2(# id SERIAL PRIMARY KEY,
ead2(# username TEXT NOT NULL,
ead2(# password TEXT NOT NULL,
ead2(# access_key varchar(40),
ead2(# secret_key(80));

INSERT INTO users (username, password, access_key, secret_key) VALUES 
('testuser', crypt('password', gen_salt('bf', 8)), 
'4dje2e45sh7d6b4d8b3647f499b7b1b445176s5w' ,
'h480bk5f34e27c6257hebsh10ed0403dc66c0a27fh1788f6869abb6756a55w78138bcdfe03j84725');


*/

// HMAC Q.4


function authenmac(req, res, next) {
    header = req.headers.authorization;
    key = header.slice(16, 26);
    signature = header.slice(37, );
    db.query(
        "SELECT access_key, secret_key from users where access_key = '" + access_key + "';"
    ).then(users => {
        access_key = users[0].access_key;
        secret_key = users[0].secret_key;
        url = "http://" + req.headers.host + req.url;
        body = req.body.value;
        const data = `${url}${body}${access_key}`;
        const signature = CryptoJS.HmacSHA256(data, secret_key);
        hmachead = `HMAC-SHA256 Key=${access_key} Signature=${Base64.stringify(signature)}`;
        if (hmachead == req.headers.authorization) {
            next();
        } else {
            res.status(401)
        }
    })
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))