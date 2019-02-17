// Webserver
const express = require('express')
// Postgress
const massive = require('massive')
const promise = require('bluebird')
const monitor = require('pg-monitor')

const app = express()
const port = 3000

//Connect using massive
massive('postgres://tom:Trollalot121@localhost:5432/pgguide', {}, {
    promiseLib: promise
}).then(db => {
    monitor.attach(db.driverConfig)

    //Find all Users
    app.get('/users', (req, res, next) => {
        db.users.find({}, {
            fields: ['email', 'details'],
            order: [{field: 'created_at', direction: 'desc'}]
        }).then(result => {
            res.json(result)
        })
    })

    //Find user via ID
    app.get('/users/:id', (req, res, next) => {
        const id = req.params.id

        db.users.findOne({
            id: id
        }, {
            fields: ['email', 'details']
        }).then(result => {
            res.json(result)
        })
    })

    //Find all products - allows for ?name= to be provided.
    app.get('/products', (req, res, next) => {
        const name = req.query.name 

        if (name !== undefined){

            db.products.find({ 
                "title ilike": `%${name}%`
            }, {
                order: [
                    { field: 'price', direction: 'asc'}
                ]
            }).then(result => {
                res.json(result)
            })
            
        }
        else{
            db.products.find({}, {
                order: [
                    { field: 'price', direction: 'asc'}
                ]
            }).then(result => {
                res.json(result)
            })
        }
    })

    //Find product by ID
    app.get('/products/:id', (req, res, next) => {
        const id = req.params.id

        db.products.findOne({
            id: id
        }).then(result => {
            res.json(result)
        })
    })

    //Find all purchases
    app.get('/purchases', (req, res, next) => {
        db.query(`
            SELECT      purchase_items.price,
                        purchase_items.quantity,
                        purchase_items.state,
                        purchases.name,
                        purchases.address,
                        purchases.state,
                        purchases.zipcode,
                        users.email,
                        products.title

            FROM        purchase_items

            INNER JOIN  purchases
            ON          purchase_items.purchase_id = purchases.id

            INNER JOIN  users
            ON          purchases.user_id = users.id

            INNER JOIN  products
            ON          purchase_items.product_id = products.id

            ORDER BY    purchase_items.price DESC`

        ).then(result => {
            res.json(result)
        })
    })

    // db.query('SELECT * FROM products WHERE title ILIKE %' + name + '% ORDER BY price ASC').then(result => {res.json(result)})
    // SQL Injection
    // http://localhost:3000/products?name=%27%20SELECT%20*%20FROM%20users--
    // SELECT * FROM products WHERE title LIKE '%'SELECT * FROM users--'"%'


    //Find product based on name - allows for SQL injection.
    app.get('/not-safe', (req, res, next) => {
        const name = req.query.name
        db.query("SELECT * FROM products WHERE title LIKE '%" + name + "%'").then(result => {
            res.json(result)
            res.end()
        })
    })

    //Find products where title is name
    app.get('/safe-query', (req, res, next) => {
        const name = req.query.name
        db.products.where("title ilike $1", [`%${name}%`]).then(products => {
            res.json(products)
        })
    })

    //run stored procedure
    app.get('/products-procedure', (req, res, next) => {
        const name = req.query.name;
        if (name !== undefined) {
            db.query(`SELECT * FROM search_product($1)`, [name]).then((products) => {
                res.json(products)
                res.end()
            })
        } else {
            res.status(404)
            res.end()
        }
    })

    //create stored procedure - run once, then procedure is saved in DB
    app.get('/create-procedure', (req, res, next) => {
        db.query(`
        CREATE OR REPLACE FUNCTION search_product(name TEXT)
        RETURNS SETOF products AS
        $BODY$
	        SELECT * FROM products WHERE title ilike '%' || name || '%';
        $BODY$
        LANGUAGE 'sql'
        `).then((res) => {
            res.json({message: 'procedure created'})
            res.end();
        })
    })
    
})


app.listen(port, () => {
    console.log(`index.js listening on port ${port}!`)
})
