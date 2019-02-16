// get dependencies
const express = require('express');
const massive = require('massive');

// set variables
const app = express();
const port = 3000;

// output connection to console
app.listen(port, () => console.log(`App listening on port ${port}!`));

/* 
Massive JS uses database reflection to create Javascript 
APIs to allow CRUD operations on a specified schema
*/

// connect to the DB using Massive JS
massive({
        host: 'localhost',
        port: 5432,
        database: 'pgguide',
        user: 'postgres', 
        enhancedFunctions: true
}).then(instance => {
        db = instance;
});

// String to display available endpoints
let info = "<h3>Available Endpoints:</h3>\
                <br><ul>\
                        <i>/users </i>\
                        <br>List all users email and sex in order of most recently created.\
                </ul>\
                <br><ul>\
                        <i>/users/:id </i>\
                        <br>List specified user's email and sex.\
                </ul>\
                <br><ul>\
                        <i>/products </i>\
                        <br>List all products in ascending order of price.\
                </ul>\
                <br><ul>\
                        <i>/products/:id </i>\
                        <br>Show details of the specified product.\
                </ul>\
                <br><ul>\
                        <i>/purchases </i>\
                        <br>List purchase items details by price in descending order, including:\
                                <ul>> Receiver's name and address.</ul>\
                                <ul>> Purchaser's email address.</ul>\
                                <ul>> Price</ul>\
                                <ul>> Quantity</ul>\
                                <ul>> Delivery Status</ul>\
                </ul>\
                <br><ul>\
                        <i>/products?name=title </i>\
                        <br>Display products by a given title i.e. Action, Dictionary, Pop CD.\
                </ul>";


/*
Display available endpoints. 
*/
app.get('/', (req, res) => {
        res.send(info);
});

/* 
List all users email and sex in order of most recently created. 
Do not include password hash in your output.
*/
app.get('/users', (req, res) => {
        db.users.find({}, {
                // filter results
                fields: 
                [
                        "email",
                        "details::json"
                ],
                // order results
                order: 
                [
                      {
                        field: 'created_at',
                        direction: 'desc',
                        nulls: 'first'
                      }  
                ]
        })
        // convert results to JSON for the response 
        .then(items => {
                res.json(items);
        });
});

/* 
List specified user's email and sex. 
Do not include password hash in your output.
*/
app.get('/users/:id', (req, res) => {
        // parse input to get the user ID value in its own
        console.log("req.params.id = " + req.params.id);
        // get the request parameters
        let id = req.params.id;
        // split on the colon (:)
        let userID = id.split(':')[1];
        // check output 
        console.log("clean string " + userID);

        // use clean ID value to get the user from DB
        db.users.find({'id = ' : userID}, {
                // filter results
                fields: 
                [
                        "email",
                        "details::json"
                ]
        })
        // convert results to JSON for the response 
        .then(items => {
                res.json(items);
        });
});


/* 
List all products in ascending order of price OR Display specific Item - SQL Injection.
*/
app.get('/products', (req, res) => {
        if(req.query.name == undefined)
        {       // undefined if no name set, just return ALL products
                console.log("params are undefined"); 
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
        // List specific product details. Attempt SQL Injection. 
        else    
        {
                console.log("params are defined: " + req.query.name);
                
                // SQL INJECTION STRING
                //Action'; INSERT INTO USERS (email, password) VALUES ('hello', 'world');--
                
               // UNSAFE
               db.query("SELECT * FROM PRODUCTS WHERE TITLE = '" + req.query.name + "';")
               .then(items => {
                       res.json(items);
               });
       
                /*
                // PARAMETERISED QUERY                
                const query = "SELECT * FROM PRODUCTS WHERE INITCAP(TITLE) = INITCAP($1)"; 
                db.query(query, req.query.name)
                        .then(items => {
                                res.json(items);
                        });
                */
               
                /*
                // STORED PROCEDURE
                db.getproductbytitle(req.query.name)
                        .then(items => {
                                res.json(items);
                        });
                */                   
        }
});

/* 
Show details of the specified product.
*/
app.get('/products/:id', (req, res) => {
        // parse input to get the user ID value in its own
        console.log("req.params.id = " + req.params.id);
        // get the request parameters
        let id = req.params.id;
        // split on the colon (:)
        let prodID = id.split(':')[1];
        // check output 
        console.log("clean string " + prodID);

        // use clean ID value to get the user from DB
        db.products.find({'id = ' : prodID})
        // convert results to JSON for the response 
        .then(items => {
                res.json(items);
        });
        
});

/*
List purchase items to include:
> receiver’s name
> receiver's address
> purchaser’s email address 
> price
> quantity
> delivery status of the purchased item. 
-- Order by price in descending order
*/
app.get('/purchases', (req, res) => {
        let query = "SELECT P.NAME, P.ADDRESS, U.EMAIL, I.PRICE, I.QUANTITY, \
        I.STATE FROM PURCHASE_ITEMS I JOIN PURCHASES P ON (I.PURCHASE_ID = P.USER_ID) \
        JOIN USERS U ON (P.ID = U.ID) ORDER BY I.PRICE DESC;";

        db.query(query)
        .then(items => {
                res.json(items);
        });
});
