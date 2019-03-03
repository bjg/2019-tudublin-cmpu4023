/*HMAC example - worksheet 2
* Enterprise application development
* Author: Dimiter Dinkov
* Student Number: C15334276
**/

//Environmental variables
const {
    PORT = 3000,
} = process.env;

//Import modules
const path = require("path");
const ejs = require("ejs");
const express = require("express");
const bp = require("body-parser");
const massive = require("massive");
const crypto = require('crypto-js');

//initialise the application
const app = express();

//configure application
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bp.json());
app.use(bp.urlencoded({extends: true}));

//configurations for the database
const config = {
    database: 'worksheet2',
    host: '127.0.0.1',
    port: 5432,
    user: 'postgres',
    password: 'mitkodi123',
    ssl: false,
};

//Authenticate the HMAC token
const hmacAuthentication = (req, res, next) => {
    //Get the authorization header
    const authorizationHeader = req.headers.authorization;
    //split the authorization header into an array because its in the for of Bearer <token>
    const authArray = authorizationHeader.split(' ');
    //Get The HMAC token
    const hmac = authArray[1];
    //Get the access key
    const access_key = authArray[3].slice(0, -1);
    //Get the message from the body
    const message = req.body.message;

    console.log(`Message ${message}`);
    console.log(`Access Key ${access_key}`);
    console.log(`The extracted hmac is ${hmac}`);

    massive(config).then(db => {
        db.query(`Select secret_key from Users_extended where access_key = $1;`, [access_key])
            .then(record => {
                const secret_key = Buffer.from(record[0].secret_key).toString('ascii');
                console.log(secret_key);
                const confirmHMAC = `${message}${access_key}`;
                let newHMAC = crypto.HmacSHA256(confirmHMAC, secret_key);
                newHMAC = Buffer.from(newHMAC.toString()).toString('base64');
                console.log(`HMACS __ ${newHMAC}`);
                if (newHMAC === hmac) {
                    next();
                } else {
                    res.sendStatus(401);
                }
            }).catch(err => console.log(err));
    });

    next();
};

//index route
app.get('/', (req, res, next) => {
    res.render('client');
});

app.post("/authenticateMessage", hmacAuthentication, (req, res, next) => {
    res.sendStatus(200);
});

//configure application to run on port 3000
app.listen(PORT, () => {
    console.log(`Application is no running on http://127.0.0.1:${PORT}`);
});