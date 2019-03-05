const express = require('express')
const massive = require('massive')
const app = express()
const port = 3000

//app.listen(port, () => console.log(`Example app listening on port ${port}!`))

// Set up massiveJS
massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'piela'
}).then(instance => {

    app.set('db', instance);
    //Get users - emails, and sex in order of the most recently created
    //at http://localhost:3000/users
    app.get("/users", (req, res) => {
        req.app
        .get('db')
        .query("SELECT email, details -> 'sex' AS sex, created_at FROM users ORDER BY created_at DESC")
        .then(query => {
            res.status(200).json(query);
        })
    });

    //Get user by id
    //at http://localhost:3000/users/'id'
    app.get("/users/:id", (req, res) => {
        req.app
        .get('db')
        .query("SELECT email, details -> 'sex' AS sex FROM users WHERE id = ${id}", {id: req.params.id})
        .then(query => {
            res.status(200).json(query);
        })
    });

    //Get products
    //at http://localhost:3000/products
    app.get("/products", (req, res) => {
        req.app
        .get('db')
        .query("SELECT * FROM products ORDER BY price ASC")
        .then(query => {
            res.status(200).json(query);
        })
    });

    //Get product by id
    //at http://localhost:3000/products/'id'
    app.get("/products/:id", (req, res) => {
        req.app
        .get('db')
        .query("SELECT * FROM products WHERE id = ${id}", {
            id: req.params.id
        })
        .then(query => {
            res.status(200).json(query);
        })
    });

    //Get purchases
    //at http://localhost:3000/purchases
    app.get("/purchases", (req, res) => {
        req.app
        .get('db')
        .query("SELECT a.purchase_id, c.email, a.price, a.quantity, a.state, b.address, b.name " +
        " FROM purchase_items a" + 
        " JOIN purchases b ON a.purchase_id = b.id " +
        " JOIN users c ON b.user_id = c.id " +
        " ORDER BY a.price DESC")
        .then(query => {
            res.status(200).json(query);
        })
    });

    
    //Unsafe get products by title query
    //at http://localhost:3000/unsafe/products
    //http://localhost:3000/unsafe/products?name=Products1 ; UPDATE products SET title = 'hacked' WHERE id = 1;
    app.get("/unsafe/products", (req, res) => {
        const title = req.query.title;
        req.app
        .get("db")
        .query("select * from products where title ='" + title + "'")
        .then(query => {
           res.status(200).json(query);
        })
    });

    //Parameterised query 
    //localhost:3000/safe1/products
    app.get("/safe1/products", (req, res) => {
        const title = req.query.title;
        req.app
        .get('db')
        .query("SELECT * FROM products WHERE title = $1", [title])
        .then(query => {
            res.status(200).json(query);
        })
    });

    //Stored procedure
    //localhost:3000/safe2/products
    app.get("/safe2/products", (req, res) => {
        req.app
        .get('db')
        .query("SELECT * FROM products WHERE title = $1", [req.query.title])
        .then(query => {
            res.status(200).json(query);
        })
    });




    app.listen(3000, () => console.log('Listening on port 3000!'));

});