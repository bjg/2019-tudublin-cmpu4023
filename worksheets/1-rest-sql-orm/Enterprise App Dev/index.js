//Helen Murphy
//C15303381
//Lab 1 EAD

//set up
const express = require('express');
const port = 3000;
const massive = require('massive');
const app = express();
app.use(express.static('app/public'));



//Setting up the connection to postgres using massive on port 5432
massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'postgres',
    password: 'pass'
}).then(instance => {

    //sets db as the current instance
    app.set('db', instance);


    //gets all users
    app.get('/users', (req, res) => {

        let query = 'SELECT id, email, details FROM users ORDER BY created_at DESC';

        req.app.get('db').query(query).then(users => {

            res.json(users)});
    });


    //gets users with matching id number
    app.get('/users/:id', (req, res) => {

        let id = req.params.id;
        let query = "SELECT id, email, details FROM users WHERE id = '" + id + "'";

        req.app.get('db').query(query).then(users => {

            res.json(users)});
    });


    //gets all products
    //Commented out so the other query can run
    /*
    app.get('/products', (req, res) => {

        let query = "SELECT * from products";

        req.app.get('db').query(query, [req.query.name]).then(products => {

            res.json(products);
        });

    });
    */


    //gets purchases with matching id number
    app.get('/products/:id', (req, res) => {

        let query = "select * FROM products WHERE id= '" + req.params.id + "'" + " ORDER BY price ASC";

        req.app.get('db').query(query).then(products => {

            res.json(products);
        });
    });


    app.get('/purchases', (req, res) => {

        query = "SElECT purchase_items.price, purchase_items.quantity, purchase_items.state, purchases.name AS RECEIVER_NAME"
            + ", purchases.address AS RECEIVER_ADDRESS, users.email AS PURCHASERS_EMAIL from purchase_items "
            + "INNER JOIN PURCHASES ON (purchase_items.purchase_id=purchases.id) INNER JOIN USERS ON (purchases.user_id=users.id) ORDER BY price DESC";

        req.app.get('db').query(query).then(purchases => {
            res.json(purchases);
        });

    });



    app.get('/products', (req, res) => {

        /*
        console.log("query received");
            if(req.query.name != null){
                query = "SELECT * FROM products  WHERE title = '" + req.query.name + "'"
            }

            req.app.get('db').query(query).then(products => {
                    res.json(products);
            });
        */
            //paramaterised query
            //by storing the first param in $1 and this automatically espaces the paramaters
            //let query = "SELECT * FROM products WHERE title = $1";


            //This uses the stored procedure in the psql database to extract the data
            //A psql procedure was called getproductbyname
            let query = "SELECT getproductbyname('" + req.query.name + "')";

            req.app.get('db').query(query , [req.query.name]).then(products => {
                res.json(products);
            });


    });



    //Listens to active port
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));

});//end massive connection


