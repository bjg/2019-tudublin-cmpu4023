// Required modules and object constructors
const express = require('express')
const app = express()
const massive = require('massive')
const port = 3000

/**
 * Massive Database Configuration Object
 *
 * @property {(function|function[])} host: Postgress server host name/IP address
 * @property {(function|function[])} post: Posgresss server host port number
 * @property {(function|function[])} database: Posgress database name
 * @property {(function|function[])} user: Posgress server username
 * @property {(function|function[])} password: Postgress server password
 * @property {(function|function[])} ssl: Use SSL or not
 * @property {(function|function[])} poolsize: legacy property, maximum size of the connection pool
 * 
 * @returns {Promise} - A promise that returns an instance of the database connection
 */

/**
 * express().set()
 *
 * @param{string} 'db' - Setting the strig value 'db' to the Massive DB instance
 * @param{Express(Database object)} instance - The previously returned object to be set
 */
massive({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'supersafepassword',
    ssl: false,
    poolSize: 10
}).then(instance => {
    app.set('db', instance)
})

// Question 1
/**
 * Exprees /GET Route, pass the defined route and results to a callback function.
 *
 * @function get
 * @param {string} - 'users'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Query to the postgress database
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} result - the returned results from the previous DB query
 */
app.get('/users', function(req, res, next) {
    req.app.get('db').query(
        'SELECT email,details FROM users ORDER BY created_at').then(result => {
        res.send(result)
    })
})

// GET Users by ID
/**
 * Exprees /GET Route, pass the defined route to a specific user id and results to a callback function.
 *
 * @function get
 * @param {string} - 'users/:id'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Query to the postgress database with a specific ID
 * I used the middleware params object to access the passed ID value
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} result - the returned results from the previous DB query
 */
app.get('/users/:id', function(req, res, next) {
    req.app.get('db').query(
        'SELECT email,details FROM users WHERE id = ' + req.params.id).then(result => {
        res.send(result)
    })
})

// GET Purchases
/**
 * Exprees /GET Route, pass the defined route and results to a callback function.
 * List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, 
 * quantity and delivery status of the purchased item. Order by price in descending order
 *
 * @function get
 * @param {string} - 'purchases'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Query to the postgress database
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 * Possible Error is caught if not resolved
 */

/**
 * express().send()
 * 
 * @param {object} result - the returned results from the previous DB query
 */
app.get('/purchases', function(req, res, next) {
    req.app.get('db').query(
        'SELECT P.name,P.address,U.email,I.price,I.quantity,I.state FROM purchases AS P,users AS U,purchase_items AS I WHERE P.user_id=U.id AND I.purchase_id=P.id ORDER BY I.Price DESC'
    ).then(result => {
        res.send(result)
    }).catch(function(error) {
        console.log(error);
    })
})

// GET Products
/**
 * Exprees /GET Route, pass the defined route and results to a callback function.
 *
 * @function get
 * @param {string} - 'purchases'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Query to the postgress database
 * THe query results are ordered by the products prices ascending
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} result - the returned results from the previous DB query
 */
app.get('/products', function(req, res, next) {
    let name = req.query.name
    if (typeof name !== 'undefined') {
        req.app.get('db').query('SELECT * FROM products WHERE title =\'' + name + '\'')
            .then(result => res.send(result))
            .catch(err => res.sendStatus(500))
    } else {
        req.app.get('db').query('SELECT * FROM products ORDER BY price ASC')
            .then(result => res.send(result))
            .catch(err => res.sendStatus(500))
    }
})

// Question 2
/**
 * Exprees /GET Route, pass the defined route to a specific product ID/Title and results to a callback function.
 *
 * @function get
 * @param {string} - 'products/:id'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Query to the postgress database
 * Two different quests, only one is performed after an undefined variable check
 * For this question, we were asked to implement an unsave SQL query
 * My test sql inject was localhost:3000/products/Dictionary'; DELETE FROM users WHERE id=1; --
 * The colon ends both SQL queries, and the trailling hyphens remove any following characters
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} result - The returned results from the previous DB query
 * @param {int} 500 - A final else state passes an error status
 */
app.get('/products/:id?', function(req, res, next) {
    req.app.get('db').query('SELECT * FROM products WHERE id = ' + req.params.id)
        .then(result => res.send(result))
        .catch(err => res.sendStatus(500))
})

/** Question 3 Safe Version 1 - Paramaterised Query 
 * Exprees /GET Route, pass the defined route and results to a callback function.
 *
 * @function get
 * @param {string} - 'purchases'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Paramaterised Query to the postgress database
 * This section deals with the unsafe SQL query above by using a paramaterised Query
 * localhost:3000/products/safe2?name=Dictionary
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} err - the resulting error is send in full to the client
 */
app.get('/products/safe1/:name', function(req, res, next) {
    let name = req.params.name
    req.app.get('db').query('SELECT * FROM products WHERE title = $1', [name])
        .then(result => res.send(result))
        .catch(err => res.send(err))
})

/** Question 3 Safe Version 2 - Stored Procedure
 * Exprees /GET Route, pass the defined route and results to a callback function.
 *
 * @function get
 * @param {string} - 'purchases'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Stored Procedure Query to the postgress database
 * This section deals with the unsafe SQL query above by using a stored procedure
 * This is a pre written function that accepts a string and then runs an SQL query
 * localhost:3000/products/safe2/Dictionary
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} err - the resulting error is send in full to the client
 */
app.get('/products/safe2/:name', function(req, res, next) {
    let name = req.params.name
    req.app.get('db').select_products(name)
        .then(result => res.send(result))
        .catch(err => console.log(err))
})

/** Question 3 Safe Version 3 - Model.find()
 * Exprees /GET Route, pass the defined route and results to a callback function.
 *
 * @function get
 * @param {string} - 'purchases'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * This section deals with the unsafe SQL query above by using a express().table_name.find()
 * This function will search the table given a set of parameters
 * If not found, or a potential SQL injection occurs, an error will return
 * localhost:3000/products/safe3/Dictionary
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} err - the resulting error is send in full to the client
 */
app.get('/products/safe3/:name', function(req, res, next) {
    let name = req.params.name
    req.app.get('db').products.find({ title: name })
        .then(result => res.send(result))
        .catch(err => res.send(err))
})


// Start the server listing on port 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`))