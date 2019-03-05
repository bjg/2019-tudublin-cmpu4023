
const massive = require("massive");
const crypto = require('crypto-js');
const express = require("express");
var cors = require('cors');

const app = express();
app.use(cors())
const path = require("path");
const ejs = require("ejs");
//sets the view engine to ejs
app.set('view engine', 'ejs');

const bodyparser = require("body-parser");

const port = 3000;

app.set('views', __dirname + '/views');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extends: true}));

const config = {
    host: '127.0.0.1',
        port: 5432,
        database: 'postgres',
        user: 'postgres',
        password: 'piela',
        ssl: false
};


const hmacAuth = (req, res, next) => {

    const headers = req.headers.authorization;
    //splits the headers to seperate the token
    const authHeaders = headers.split(' ');
    const hmac = authHeaders[1];
    //formats the access key
    const accesskey = authHeaders[3].slice(0, -1);
    //gets the msg from body
    const message = req.body.message;

    massive(config).then(db => {
        
    db.query('SELECT secretkey FROM Users WHERE accesskey = $1;', [accesskey])
        .then(record => {

            const secretkey = Buffer.from(record[0].secretkey).toString('ascii');

            const check = '${message}${accesskey}';
            const encrypted = crypto.HmacSHA256(check, secretkey);
            encrypted = Buffer.from(encrypted.toString()).toString('base64');

            if (encrypted === hmac) {
                next();
            } else {
                res.sendStatus(401);
                }
            }).catch(err => console.log(err));
    });
    next();
};

//home page
app.get('/', (req, res, next) => {
    res.render('client');
});

app.post("/hmacauth", hmacAuth, (req, res, next) => {
    res.sendStatus(200);
});



app.listen(port, () => console.log(`Example app listening on port ${port}!`))