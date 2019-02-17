const express = require('express')
const massive = require('massive')
const bluebird = require('bluebird')
const monitor = require('pg-monitor')
const app = express()
const port = 3000

massive('postgres://postgres:Flanker7@localhost:5432/pgguide').then(db => {
  monitor.attach(db.driverConfig);

  /**
   * List all users email and sex in order of most recently created.
   * Do not include password hash in your output
   *
   * Problem sets 1) GET /users
   */
  app.get('/users', (req, res, next) => {
    db.query(`SELECT "email", "details" -> 'sex' AS "sex" FROM "users" ORDER BY "created_at"`).then(result => {
        res.json(result);
    });
  });

    /**
     * Show above details of the specified user
     *
     * Problem sets 1) GET /users/:id
     */
    app.get('/users/:id', (req, res, next) => {
        const id = req.params.id;

        db.query(`SELECT "email", "details" -> 'sex' AS "sex" FROM users WHERE id = ${id}`).then(result => {
            res.json(result);
        })
    });


    /**
     * List all products in ascending order of price
     *
     * Problem sets 1) GET /products
     */
    app.get('/products', (req, res, next) => {
        db.query(`SELECT * FROM products ORDER BY price ASC`).then(result => {
            res.json(result);
        });
    });

    /**
     * Show details of the specified products
     *
     * Problem sets 1) GET /products/:id
     */
    app.get('/products/:id', (req, res, next) => {
        const id = req.params.id;

        db.query(`SELECT * FROM users WHERE id = ${id}`).then(result => {
            res.json(result);
        })
    });

    /**
     * List purchase items to include the receiver’s name and, address,
     * the purchaser’s email address and the price, quantity and delivery
     * status of the purchased item. Order by price in descending order
     *
     * Problem sets 1) GET /purchases
     */
    app.get(`/purchases`, (req, res, next) => {
        db.query(`SELECT "name", "address", "email", "price", "quantity", purchase_items.state FROM purchases
        LEFT JOIN users ON users.id = purchases.user_id LEFT JOIN purchase_items ON purchase_items.purchase_id = purchases.id
        ORDER BY "price" DESC`).then(result => {
            res.json(result);
        });
    });


    /**
     * Implement the query (badly) in such as way as to allow
     * an attacker to inject arbitrary SQL code into the query
     * execution
     *
     * Problem set 2) GET /products[?name=string]
     */
    app.get('/injectsql', async (req, res) => {
        const name = req.query.name;

        db.query("SELECT * FROM products WHERE title LIKE '%" + name + "%' ORDER BY price ASC").then(result => {
            res.json(result);
        });
    });


    /**
     * Provide 2 solutions to prevent SQL injection
     *
     * Problem set 3) parameterised query
     */

    app.get('/protectagainstinjection1', (req, res, next) => {
        const name = req.query.name;
        db.products.where("title ilike $1", [`%${name}%`]).then(products => {
            res.json(products);
        });
    });


    //tried to use prepared statement
    app.get('/protectagainstinjection2', (req, res, next) => {
        var sql = "SELECT * FROM products WHERE name = ?";
        var inserts = "SELECT name FROM products";
        sql = mysql.format(sql, inserts);
        sql.then(result => {
            res.json(result);
        });
    });

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});