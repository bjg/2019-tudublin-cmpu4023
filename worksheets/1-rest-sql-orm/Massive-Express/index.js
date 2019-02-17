/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 1
 *	Questions: 1,2 and 3.
 *	Type: HTTP Endpoints."
 ***/

const express = require('express');
const massive = require('massive');
const app = express()
const port = 3000

// https://www.npmjs.com/package/pg-hstore
let hstoreFormat = require('pg-hstore')();

massive({
    
    /* Databse Setup */
    host: '127.0.0.1',
    port: 5432,
    database: 'pgguide',
    user: 'gg',
    password: 'qqqq'
    
}).then(instance => {
    
    /* 
        SETUP 
    */

    // Setting Database.
    app.set('db', instance);
    
    // Landing page.
    app.get('/', (req, res) => res.send('RestAPI SQL and ORM - Gabriel Grimberg'))
    
    // Listen for connection.
    app.listen(port, () => console.log(`App Live: Listening on port ${port}!`))
    
    /* --------------------------------- */

    /* 
        GET /users 
    */

    /*
        Test this: http://localhost:3000/users
    */

    app.get('/users', (req, res) => {
        
        // Request from the database all from the users table.
        req.app.get('db').users.find({}, {
            
            fields: ['email', 'details'], // Using specific fields. (To not inlcude password hash)
            order: [{field: 'created_at', direction: 'desc'}] // Order the output with the most recently created.
            
        }).then(results => { // Promise to take in the results.
            
            res.json(results.map(event => { // Map through each result
                
                let details;

                try {
                    
                    // Parse the results that was given in the promise then store the parsed data in details.
                    // Needed as "details" is an array in the database.
                    hstoreFormat.parse(event.details, result => { details = result; });
                    
                } catch(error) { // If sex does not have a field.
                
                    details = { "sex" : null };
                }

                return {  // Return the results.

                    "email": event.email, 
                    "sex": details.sex 
                }
                
            }));
            
        }).catch(error => { // Catch any errors and display it on the screen.
            
            console.error(error);
            res.send("An error has occured.");
        });

    });
    
    /* --------------------------------- */

    /* 
        GET /users/:id 
    */

    /*
        Test this: http://localhost:3000/users/2
    */

    app.get('/users/:id', (req, res) => {
        
        // Request from the database from the users table using the ID provided.
        req.app.get('db').users.find({ 'id': req.params.id }, {
            
            fields: ['email', 'details'], // Using specific fields. (To not inlcude password hash)
            
        }).then(results => { // Promise to take in the results.
            
            res.json(results.map(event => { // Map through each result
                
                let details;
                
                try {

                    // Parse the results that was given in the promise then store the parsed data in details.
                    // Needed as "details" is an array in the database.
                    hstoreFormat.parse(event.details, result => { details = result; });
                    
                    } catch(error) { // If sex does not have a field.
                        
                        details = {"sex" : null};
                    }

                    return { // Return the results.

                        "email": event.email, 
                        "sex": details.sex
                    };
                    
            }));
            
        }).catch(error => { // Catch any errors and display it on the screen.
            
            console.error(error);
            res.send("An error has occured.");
        });

    });
    
    /* --------------------------------- */

    /*
        * Question 1 *

        GET /products
    */

    // app.get('/products', (req, res) => {
        
    //     // Access the Database and find everything in products.
    //     req.app.get('db').products.find({}, {

    //         // Order it by price in ascending order.
    //         order: [{field: 'price', direction: 'asc'}]
        
    //     }).then(results => { // Callback, take the results.
            
    //         // Display the results in JSON format.
    //         res.json(results);
        
    //     }).catch(error => { // Catch any errors and display it on the screen.
            
    //         console.error(error);
    //         res.send("An error has occured.");
    //     });
    
    // });

    /* --------------------------------- */

    /* 
        * Question 2 *

        GET /products[?name=string] 
    */

    /*
        Test this: http://localhost:3000/products
    */
    app.get('/products', (req, res) => {

        // Extending search using name.
        const name = req.query.name;
        
        if (typeof name === 'undefined') { // If the name doesn't exist.

            // Access the Database and find everything in products.
            req.app.get('db').products.find({}, {

                // Order it by price in ascending order.
                order: [{field: 'price', direction: 'asc'}]
        
            }).then(results => { // Callback, take the results.
            
                // Display the results in JSON format.
                res.json(results);
        
            }).catch(error => { // Catch any errors and display it on the screen.
            
                console.error(error);
                res.send("An error has occured.");
            });

        } else { // Bad Query that is prone to SQL Injection.

            /*
                Test this: http://localhost:3000/products/?name=Dictionary
            */

            /*
                http://localhost:3000/products?name=';DELETE FROM PRODUCTS WHERE id=24 OR title LIKE '
            */
            // The quote is inserted which is prone to SQL Injection as it terminates the query early.
            req.app.get('db').query("\
                SELECT *\
                FROM products\
                WHERE products.title\
                LIKE " + "'" + name + "'"
            
            ).then(results => {

                res.json(results);

            }).catch(error => { // Catch any errors and display it on the screen.

                console.error(error);
                res.send("An error has occured.");
            });

        }

    });

    /* --------------------------------- */

    /* 
        * Question 3 *

        GET /products[?name=string] 
    */

    /*
        Test this: http://localhost:3000/productssol1
    */
    app.get('/productssol1', (req, res) => {
        
        // Extending search using name.
        const name = req.query.name;
    
        if (typeof name === 'undefined') { // If the name doesn't exist.

            // Access the Database and find everything in products.
            req.app.get('db').products.find({}, {

                // Order it by price in ascending order.
                order: [{field: 'price', direction: 'asc'}]
        
            }).then(results => { // Callback, take the results.
            
                // Display the results in JSON format.
                res.json(results);
        
            }).catch(error => { // Catch any errors and display it on the screen.
            
                console.error(error);
                res.send("An error has occured.");
            });

        } else { // Using a parameterised query

            req.app.get('db').products.find({

                "title": name

            }).then(results => {

                res.json(results);

            }).catch(error => { // Catch any errors and display it on the screen.

                console.error(error);
                res.send("An error has occured.");
            });

        }

    });

    /* --------------------------------- */

    /* 
        * Question 3 *

        GET /products[?name=string] 
    */

    /*
        Test this: http://localhost:3000/productssol2
    */
    app.get('/productssol2', (req, res) => {
        
        // Extending search using name.
        const name = req.query.name;

        if (typeof name === 'undefined') { // If the name doesn't exist.

            // Access the Database and find everything in products.
            req.app.get('db').products.find({}, {

                // Order it by price in ascending order.
                order: [{field: 'price', direction: 'asc'}]
        
            }).then(results => { // Callback, take the results.
            
                // Display the results in JSON format.
                res.json(results);
        
            }).catch(error => { // Catch any errors and display it on the screen.
            
                console.error(error);
                res.send("An error has occured.");
            });

        } else { // Using a stored procedure.

            /*
                CREATE OR REPLACE FUNCTION getnameofproduct(name VARCHAR(70)) RETURNS TABLE(id INTEGER, title VARCHAR(255), price NUMERIC) AS $$
                BEGIN
                    RETURN QUERY
                    SELECT products.id, products.title, products.price FROM products WHERE products.title LIKE name;
                END;
                $$ LANGUAGE plpgsql;
                '
            */
            
            req.app.get('db').getnameofproduct(name).then(results => {
                
                res.json(results);
            
            }).catch(error => { // Catch any errors and display it on the screen.
                
                console.error(error);
                res.send("An error has occured.");
            });

        }

    });

    /* --------------------------------- */

    /* 
        GET /products/:id 
    */

    /*
        Test this: http://localhost:3000/products/1
    */
    app.get('/products/:id', (req, res) => {

        // Request to access the database to find the products table with the ID field.
        req.app.get('db').products.find({

            'id': req.params.id

        }).then(results => {

            res.json(results);

        }).catch(error => { // Catch any errors and display it on the screen.

            console.error(error);
            res.send("An error has occured.");
        });

    });

    /* --------------------------------- */

    /* 
        GET /purchases 
    */

    /*
        Test this: http://localhost:3000/purchases
    */
    app.get('/purchases', (req, res) => {

        // Request with the following SQL query.
        req.app.get('db').query("\
            SELECT purchases.name, purchases.address, users.email, products.title, products.price, purchase_items.quantity, purchase_items.state\
            FROM purchases\
            JOIN users ON purchases.user_id = users.id\
            JOIN purchase_items ON purchase_items.purchase_id = purchases.id\
            JOIN products ON purchase_items.product_id = products.id\
            ORDER BY products.price DESC"
            
        ).then(results => { // Promise to take in the following results and to display them.

            // Display the results in JSON format.
            res.json(results);

        }).catch(error => { // Catch any errors and display it on the screen.

            console.error(error);
            res.send("An error has occured.");
        });

    });
    
});