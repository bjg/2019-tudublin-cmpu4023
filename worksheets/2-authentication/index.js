const express = require('express');
const jwt = require('jsonwebtoken');
const massive = require('massive');
const decode = require('jsonwebtoken/decode');
const crypto = require('crypto');
const app = express();
const port = 3000;

// required for parsing request.body objects
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json()); 


// connect to the DB using Massive JS
massive({
        host: 'localhost',
        port: 5432,
        database: 'auth',
        user: 'nicola', 
        password: 'Password',
        enhancedFunctions: true
}).then(instance => {
        db = instance;
});

// output connection to console
app.listen(port, () => console.log(`App listening on port ${port}!`));

// #####################################################################################################
// ROUTES - AVAILABLE AS ENDPOINTS IN REST SERVER
// #####################################################################################################

// WELCOME MESSAGE
app.get('/api', (req, res) => {
        res.json({
                message: "Welcome to the API"
        });
});


/* 
### LOGIN with NAME and PASSWORD
POST : http://localhost:3000/api/login?name=nicola&pw=pword

## AUTHENTICATE FUNCTION in Database:
CREATE OR REPLACE FUNCTION authenticate(_name TEXT, _password TEXT)
RETURNS UUID
AS $$
    SELECT * FROM USERS WHERE 
    NAME = _name AND 
    PASSWORD = crypt(_password, password);
$$ LANGUAGE SQL STRICT IMMUTABLE;
*/
app.post('/api/login', (req, res) => {

        // define query to check for authentic user      
        const query = "SELECT * FROM authenticate($1, $2)";
        // collect parameters for query
        const values = [req.query.name, req.query.pw];

        // authenticate if user+password match are in the DB          
        db.query(query, values)
        .then(items => {
                // an authenticated user recevies a token
                if(items[0]['authenticate'] != null)
                {
                        // sign the payload to get a token
                        jwt.sign({
                                // user ID
                                subject: items[0]['authenticate'],
                                // issued at time
                                iat: Math.floor(Date.now() / 1000)
                        },
                        // secret key 
                        'secretkey', 
                        // encryption algorithm
                        //{ algorithm: 'HS256'},
                        // expiration 
                        {expiresIn: '24h'},
                        // create response
                        (err, token) => {
                                // return results + token value to client
                                res.json({
                                        "result": "Success",
                                        "status": 200,  
                                        "token": token
                                })
                        });                         
                }
                else    // not an authenticated user
                {
                        // send failure response to client
                        res.send("Invalid Login");
                }
        });
});


/* 
### DISPLAY ALL PRODUCTS - PROTECTED BY JSON WEB TOKEN
GET : http://localhost:3000/api/products
*/

app.get('/api/products', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, authData) => {
                if(err)
                {
                        // UNAUTHORISED: if token is not verified successfully
                        res.sendStatus(401);
                }
                else
                {
                        // OK: res.sendStatus(200);
                        db.products.find({}, {
                                // order results
                                order: [
                                        {
                                                field: 'price',
                                                direction: 'asc',
                                                nulls: 'first'
                                        }  
                                ]
                        })
                        // convert results to JSON for the response 
                        .then(items => {
                                res.json(items);
                        });

                }
        });
        
});

/* 
### UPDATE A PRODUCT - PROTECTED BY JSON WEB TOKEN
PUT : http://localhost:3000/api/products?id=1&title=Magazine&price=4.99
*/

app.put('/api/products', verifyToken, (req, res) => {
        jwt.verify(req.token, 'secretkey', (err) => {
                if(err)
                {
                        // UNAUTHORISED: if token is not verified successfully
                        res.sendStatus(401);
                }
                else
                {
                        db.products.find({'id = ' : req.query.id})
                              .then(products => {
                                if(products){
                                        // define query to check for authentic user      
                                        const query = "UPDATE products SET title = $1, price = $2 WHERE id = $3";
                                        
                                        // collect parameters for query
                                        const values = [req.query.title, req.query.price, req.query.id];

                                        // authenticate if user+password match are in the DB          
                                        db.query(query, values)
                                        .then(items => {
                                                res.sendStatus(200);
                                        })
                                        .catch(error => console.error('Error in UPDATING product: ', error));
                                }
                        })
                        .catch(error => console.error('Error in finding product to UPDATE: ', error));

                }
        });
        
});



/* 
### CREATE A NEW PRODUCT - PROTECTED BY HMAC
OPEN NEW TERMINAL: node client.js
*/

app.post('/api/addproduct', (req, res) => {
        
        db.users.find({'accesskey = ' : req.headers.accesskey})
        .then(items => {
                if(items[0]['secretkey'] != null)
                {
                        // key values for checking signature
                        let secretkey = items[0]['secretkey'];
                        let accesskey = req.headers.accesskey;

                        // message body values for checking signature
                        let values = [req.body.title, req.body.price];
                        
                        // generate the signature using the request values
                        let verified_signature = generateSignature(accesskey, secretkey, values); 
                        
                        // check if both signatures match
                        if (verified_signature == req.headers.signature)
                        {
                                console.log("Success: Message Authenticated");

                                // perform the insert of the new product into the DB
                                db.products.insert({
                                        title: req.body.title,
                                        price: req.body.price
                                })
                                // server message
                                .then(console.log("Product Added Successfully"))
                                // send success response to client
                                .then(res.send({"message" : "Success - Message Authenticated and New Product Inserted"}))     
                                .catch(error => console.error('Error during Insert of New Product: ', error));

                        }
                        else
                        {
                                // server message
                                console.log("Failed: Message Not Authenticated");
                                // send failure response to client
                                res.send({"message":"Failed - Message Not Authenticated"});
                                // UNAUTHORISED: if token is not verified successfully
                                res.sendStatus(401);
                        }
                        
                }
                else    // not an valid accesskey
                {
                        // send failure response to client
                        res.send("Invalid Access Key");
                }
                
        })
        .catch(error => console.error('Error in finding valid Secret Key: ', error));
                        
        
});

/* 
### GET A PRODUCT BY ID - PROTECTED BY HMAC
OPEN NEW TERMINAL: node client.js
*/

app.post('/api/getproductbyid', (req, res) => {
        
        db.users.find({'accesskey = ' : req.headers.accesskey})
        .then(items => {
                if(items[0]['secretkey'] != null)
                {
                        // key values for checking signature
                        let secretkey = items[0]['secretkey'];
                        let accesskey = req.headers.accesskey;

                        // message body values for checking signature
                        let values = [req.body.id];
                        
                        // generate the signature using the request values
                        let verified_signature = generateSignature(accesskey, secretkey, values); 
                        
                        // check if both signatures match
                        if (verified_signature == req.headers.signature)
                        {
                                console.log("Success: Message Authenticated");

                                // perform the insert of the new product into the DB
                                db.products.find({
                                        id: req.body.id
                                })
                                // server message
                                .then(console.log("Product Found"))
                                // send success response to client
                                .then(items => res.json(items))     
                                .catch(error => console.error('Error during Insert of New Product: ', error));

                        }
                        else
                        {
                                // server message
                                console.log("Failed: Message Not Authenticated");
                                // send failure response to client
                                res.send({"message":"Failed - Message Not Authenticated"});
                                // UNAUTHORISED: if token is not verified successfully
                                res.sendStatus(401);
                        }
                }
                else    // not an valid accesskey
                {
                        // send failure response to client
                        res.send("Invalid Access Key");
                }  
        })
        .catch(error => console.error('Error in finding valid Secret Key: ', error));
});

// FUNCTIONS:

// Function to verify token provided in request for protected resources
function verifyToken(req, res, next)
{
        // Note: Format of Token = Authorisation: Bearer <access_token>

        // get auth header value
        const bearerHeader = req.headers['authorization'];

        // check if bearer is undefined
        if(typeof bearerHeader != 'undefined')
        {
                // split at space in token
                const bearer = bearerHeader.split(' ');
                // get token from array
                const bearerToken = bearer[1];
                // set the token
                req.token = bearerToken;
                // next middleware
                next();
        }       
        else
        {
                res.sendStatus(401);
        }
}


// function to generate the signature for verification 
function generateSignature(akey, skey, objects = [''])
{
        key = akey + skey;
        objects.forEach(item => {
                key += item;
        });

        let hmac = crypto.createHmac('sha256', key);
        return hmac.digest('hex');
}