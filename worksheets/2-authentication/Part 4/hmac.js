const express = require('express');
const bodyParser = require('body-parser');
const massive = require('massive');
const crypto = require('crypto-js');
const path = require("path");
const ejs = require("ejs");
const app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extends:true}));
app.use(bodyParser.json());

const configuration = {
    host: '127.0.0.1',
        port: 5432,
        database: 'kart',
        user: 'postgres',
        password: '8myd!nner',
        ssl: false
};

//Authenticate HMAC token
const hmacAuthentication = (req, res, next)=>{
    //Get header
    const authorizationHeader = req.headers.authorization;
    //split or parse header into array
    const authArray = authorizationHeader.split(' ');
    //Get HMAC token
    const hmac = authArray[1];
    //Get access key
    const access_key = authArray[3].slice(0,-1);
    //Get message from the body
    const message = req.body.message;
    //Debug log
    console.log(`Message ${message}`);
    console.log(`Access Key ${access_key}`);
    console.log(`The extracted hmac is ${hmac}`);

    //Get secret key from db and create new hmac
    //compare new hmac to old 
    massive(configuration).then(db => {
        db.query(`Select secret_key from users_extended where access_key = $1;`, [access_key])
    .then(record => {
    console.log(record);
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
        Status: 'Forbidden'
    }
    }).catch(err => console.log(err));
});
next();
    
};

//index route
app.get('/',(req,res,next)=> {
    res.render('client');
});

//Protected route requiring HMAC authentication
app.post("/authenticateMessage", hmacAuthentication, (req, res, next) => {
    res.sendStatus(200);
});

app.listen(3000,() => console.log('Server started on port 3000'));

