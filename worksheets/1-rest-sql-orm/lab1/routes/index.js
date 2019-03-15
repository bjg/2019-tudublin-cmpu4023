const express = require('express');
const router = express.Router();
const dbObj = require('../database/db');




///////////// Functions /////////////////////////////////////
//function used during setting up to inspect all tables
function seetables(res) {
    const db = dbObj.get('db');
    res.json(db.listTables());
}



// function to be used to query from the database
function getdata(table, res, q) {
    console.log('----------------- ' + table.toUpperCase() + ' ----------------');
    console.log(q);
    const db = dbObj.get('db');
    db.query(q).then(data => {
        // output to appear in browser
        res.json(data);
    })
}

//function to implement prepared statements for problem set 3
function preparedstatement(res, params) {
    console.log('----------------- Prepared Statement ----------------');

    //get database object
    const db = dbObj.get('db');
    console.log(params.id);
    db.query(
        'select * from products where id = ${id};', {
            id: params.id
        }
    ).then(data => {
        // returning the output
        res.json(data);
    });

}

//function to call a stored procedure from Postgres docker image. NOTE: I have already created the stored procedure via the shell
function storedprocedure(res, params) {
    console.log('----------------- stored procedure ----------------');
    //get database object
    const db = dbObj.get('db');

    db.query(
        "select * from erictest(${id})", {
            id: params.id
        }
    ).then(data => {
        // returning the output
        res.json(data);
    });

}



///////////////////// ENDPOINTS //////////////////////////
//setting up part 5 - display all of the data from each table
router.get('/settingup', (req, res, next) => {
    seetables(res);

});

// base endpoint
router.get('/home', (req, res, next) => {
    res.render('home', null);
});

// endpoint 1.1
router.get('/users', (req, res) => {
    //problem set: 1 part 1- users email and sex in order of most recently created.
    var q = 'select email, details, created_at from users ORDER BY created_at DESC ;';
    getdata('users', res, q);
}); // request response

//endpoint 1.2
router.get('/users/:id', (req, res) => {
    //problem set: 1 part 2 - users email and sex in order of most recently created where id = :id.
    var id = req.params.id;
    console.log('id:' + id)
    var q = 'select email, details, created_at from users where id = ' + id + ';';
    getdata('users', res, q);
}); // request response

//endpoint 1.3
router.get('/products', (req, res, next) => {

    if (!req.query.name) {
        console.log('no params')
        //problem set: 1 part 3- List all products in ascending order of price.
        var q = 'select * from products ORDER BY price ASC ;';
        getdata('products', res, q);
    } else {
        next();
    }


}); // request response

//endpoint 1.4
router.get('/products/:id', (req, res) => {
    //problem set: 1 part 4 - Show details of the specified products.
    var id = req.params.id;
    console.log('id:' + id)

    var q = 'select * from products  where id = ' + id + ' ORDER BY price ASC;';
    getdata('products', res, q);
}); // request response

//endpoint 1.5
router.get('/purchases', (req, res) => {
    //problem set: 1 part 5- List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, quantity and delivery status of the purchased item. Order by price in descending order.
    var q = `
    SELECT 
    Products.title,
    purchases.name, 
    purchases.address,
    users.email, 
    purchase_items.price, 
    purchase_items.quantity, 
    Purchase_items.state 
    FROM purchases
    INNER JOIN users on purchases.user_id = users.id 
    INNER JOIN purchase_items on purchase_items.purchase_id = purchases.id
    INNER JOIN products on purchase_items.product_id = products.id
    ORDER BY purchase_items.price DESC;`;

    getdata('users, purchases, purchaseitems and products', res, q);
}); // request response

//Problem set 2. filtering by name. badly.
router.get('/products', (req, res) => {
    if (req.query.name) {
        console.log('got params!');
        const name = req.query.name; // name is the actual variable name
        console.log(name);
        var q = "select * from products where title = '" + name + "'"; // NOTE no semicolon so I can try SQLINJECTION
        getdata('products', res, q);

        /* BAD EXAMPLES - SQL INJECTION EXAMPLES: 
        http://localhost:3000/products?name=Dictionary' ; Delete from purchase_items ;select * from products where id > '0
        http://localhost:3000/products?name=Dictionary' or title = 'Python Book
        http://localhost:3000/products?name=Ruby Book' or title = 'Baby Book
        http://localhost:3000/products?name=Ruby Book' or title = 'Baby Book
        http://localhost:3000/products?name=Ruby Book' ; select price, title from products where title = 'Python Book

        */
    }

}); // request response

//Problem set 3. 3.1 Using prepared statements
router.get('/prepared/products/:id', (req, res) => {
    const params = req.params;
    preparedstatement(res, params);

    //test that it is imposible to use SQL injection
    //http://localhost:3000/prepared/products/1 OR 1=1
})

//problem set 3. 3.2 Stored Procedure
router.get('/storedprocedure/products/:id', (req, res) => {
    const params = req.params;
    storedprocedure(res, params);


    /**
            CREATE OR REPLACE FUNCTION erictest(id integer)
            Returns setof products AS $func$
            DECLARE
            Sql text:='SELECT * FROM products WHERE id = $1';
            BEGIN
            RETURN QUERY EXECUTE sql
            USING id;
            END;
            $func$ LANGUAGE plpgsql;

     * 
     */

    //test that it is imposible to use SQL injection
    //http://localhost:3000/storedprocedure/products/1 OR 1=1
})

//exporting the router module so it can be imported
module.exports = router