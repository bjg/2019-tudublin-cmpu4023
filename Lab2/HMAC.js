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
    database: 'freshdb',
    user: 'postgres',
    password: 'test1234',
    enhancedFunctions: true
  }).then(instance => {
    app.set('db', instance);
  
    app.get('/', (req, res) => {
        res.send("Worksheet 2 HMAC testing, my brain hurts :(");
    });

    // Products table query which calls an authentication function before it executes
    app.post("/products", authenticate, (req, res) => {
        instance.query(
            "select * from products;"
        ).then(products => {
            //returning status 200 and the products table to console
            res.status(200).send(products); 
        }) 
    });

// Authentication middleware for protected endpoints
function authenticate(req, res, next) {
    /*
     * The steps for implementing this function are as follows:
     * 
     *  1. Extract the authorization header from req.headers
     *  2. You can have formatted this header any way you like but if you want it to
     *     work with the example client in this repo it needs to be of the form:
     *         HMAC-SHA256 Key=KEY Signature=SIGNATURE
     *  3. Parse the header and extract the values of KEY and SIGNATURE
     *  4. Query the database for the access key matching KEY and compute the signature
     *     from the secret key. You can compute this in the database or in Express
     *     whichever you prefer (although the former is a more secure implementation)
     *  5. Compare the computed signature with SIGNATURE (from the request). If they
     *     match then call next(), otherwise respond with a 401
     */
    // YOUR CODE GOES HERE

    // placing the authoriztiaon header into a variable
    // slicing the key and signature from the header
    header = req.headers.authorization;
    key = header.slice(16,26);
    signature = header.slice(37,);

    console.log(req.headers.authorization);
    //console.log(req);
    //console.log(req.headers.host);
    //console.log(req.url);

    //console.log(key);
    //console.log(signature);
    //console.log(header);

        instance.query(
            "SELECT access_key, secret_key from users where access_key = '"+key+"';"
        ).then(users => {

            //getting the keys from the query
            access_key = users[0].access_key;
            secret_key = users[0].secret_key;
            //creating the url
            url = "http://"+req.headers.host+req.url;
            //retrieving the data from the message body
            body_data = req.body.value;

            //Doing the same as the client.js code with the parameters passed in from the browser
            const data = `${url}${body_data}${access_key}`;
            const signature = CryptoJS.HmacSHA256(data, secret_key);
            new_header = `HMAC-SHA256 Key=${access_key} Signature=${Base64.stringify(signature)}`;

            //checking if the new header created matched the one passed from the client
            if(new_header == req.headers.authorization){
                console.log(new_title);
                // proceeding back onto the /products query
                next();
            }
            else{
                res.status(401).send("ERROR")
            }  
        })
    }
     http.createServer(app).listen(3001,()=>{
         console.log("App is listening on http://127.0.0.1:3001");
     });
});