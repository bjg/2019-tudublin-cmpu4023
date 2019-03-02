/***
 *	Name: Gabriel Grimberg
 *	Module: Enterprise Application Development
 *	Lab: 1
 *	Questions: 4,5 and 6
 *	Type: Sequalize"
 ***/

// http://docs.sequelizejs.com/manual/tutorial/migrations.html

const express = require('express');
const app = express()
const port = 3000
const bodyParser = require('body-parser');

var db = require('./models');
var sProducts = db.products;

/* 
    SETUP 
*/

// Obtain JSON from Requests.
app.use(bodyParser.json());

// Root.
app.get('/', (req, res) => { res.send('Lab 1: RESTful API using Sequelize and Express'); });

// Server Setup.
app.listen(port, () => { db.sequelize.sync(); });

/* --------------------------------- */

/* 
    GET /products[?name=string] 
*/
app.get('/products', (req, res) => {
    
    // Extending search using name.
    const name = req.query.name;
    
    if (typeof name === 'undefined') { // If the name doesn't exist.

        // Access the Database and find everything in products.
        sProducts.findAll().then(results => { // Callback, take the results.
        
            // Display the results in JSON format.
            res.json(results);
    
        }).catch(error => { // Catch any errors.
        
            console.error(error);
            res.send("An error has occured.");
        });

    } else {
        
        /*
            Test this: http://localhost:3000/products/?name=Dictionary
        */
       
        sProducts.findAll({

            where: { title: name }
            
        }).then(results => {

            res.json(results);

        }).catch(error => {

            console.error(error);
            res.send("An error has occured.");
        });
    }  
});

/* --------------------------------- */

/* 
    GET /products/:id 
*/

app.get('/products/:id', (req, res) => {

    sProducts.findAll({

        where: { id: req.params.id }

    }).then(results => {

        res.json(results);

    }).catch(error => {

        console.error(error);
        res.send("An error has occured.");
    });

});

/* --------------------------------- */

/* 
    POST /products/
*/
app.post('/products', (req, res) => {
    
    // Access the database and create a new instance
    sProducts.create(req.body).then( results => {
        
        // If a new record was entered and the ID is greater than 0.
        if (results._options.isNewRecord && results.dataValues.id > 0) {
            
            // Send a message to the user that the product has been created.
            res.send("New Product Created with an ID of: " + results.dataValues.id);

        } else { // Otherwise it was a fail and notify the user about it.

            res.send("Failed to create a new product.");
        }
    
    }).catch( error => { // Catch any errors and notify the user about it.
        
        console.error(error);
        res.send("An error has occured.");
    });

});

/* --------------------------------- */

/* 
    PUT /products/:id
*/
app.put('/products/:id', (req, res) => {
    
    // Access the database and update a given instance.
    sProducts.update(req.body, {
        
        // Take in the ID from the params.
        where: { id: req.params.id }

    }).then( results => {
        
        if (results > 0) { // If the results is greater than 0 then it was a success.
            
            res.send("The Product with the supplied ID has been updated.");
        
        } else { // Otherwise it was a fail, make sure to notify the user.
            
            res.send("Failed to update the specific product.");
        }

    }).catch(error => { // Catch any errors and let the user know.
        
        console.error(error);
        res.send("An error has occured.");
    });

});

/* --------------------------------- */

/* 
    DELETE /products/:id
*/

app.delete('/products/:id', (req,res) => {
    
    // Access the database and delete a given instance.
    sProducts.destroy({
        
        // Take in the ID from the params.
        where: { id: req.params.id }

    }).then(results => {
        
        if (results > 0) { // If the results is greater than 0 then it was a success.
            
            res.send("The Product with the supplied ID has been deleted.");

        } else { // Otherwise it was a fail, make sure to notify the user.
          
        res.send("Failed to delete the specific product.");
    
        }

    }).catch(error => { // Catch any errors and let the user know.
        
        console.error(error);
        res.send("An error has occured.");
    });

});