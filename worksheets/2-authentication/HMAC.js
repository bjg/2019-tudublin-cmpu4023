const express = require("express");
const http = require("http");
const massive = require("massive");
const bodyParser = require("body-parser");
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");

const app = express();
app.use(bodyParser.json());

massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'lab2',
    user: 'steve',
    password: 'q1W2e£R$',
    enhancedFunctions: true
  }).then(instance => {
    app.set('db', instance);
  
    app.get('/', (req, res) => {
        res.send("Worksheet 2, C15446768");
    });


    // Protected resource
    app.post("/products", authenticate, (req, res) => {
        instance.query(
            "select * from products;"
        ).then(products => {
            res.status(200).send(products);
        }) 
    });

// Authentication middleware for protected endpoints
function authenticate(req, res, next) {
    header = req.headers.authorization;
    console.log(header);
    //Slices where the key and signature is
    key = header.slice(16,20);
    signature = header.slice(32,);
    console.log(key);

        instance.query(
            "SELECT public, secret from users where public = '"+key+"';"
        ).then(users => {
            //console.log(users);
            console.log(users);
            access_key = users[0].public;
            secret_key = users[0].secret;
            yeet = req.body.value;

            test = "http://" + req.headers.host + req.url;

            const data = `${test}${yeet}${access_key}`;
            const signature = CryptoJS.HmacSHA256(data, secret_key);
            new_title = `HMAC-SHA256 Key=${access_key} Signature=${Base64.stringify(signature)}`;

            if(new_title == req.headers.authorization){
                console.log(new_title);
                next();
            }
            else{
                res.status(401).send("ERROR")
            }  
        })
    }
     http.createServer(app).listen(1337,()=>{
         console.log("App is listening on http://127.0.0.1:1337");
     });
});