// Required modules and object constructors
const express = require('express')
const Sequelize = require('sequelize')
const Chance = require('chance')

const chance = new Chance()
const app = express()
/**
 * Sequelize Constructor Object
 *
 * @property {(function|function[])} host: The host of the relational database.
 * @property {(function|function[])} dialect: The dialect of the database you are connecting to. One of mysql, postgres, sqlite and mssql.
 * @property {(function|function[])} operatorsAliases: Posgress database name
 * @property {(function|function[])} pool: Posgress server username
 */
const sequelize = new Sequelize('postgres', 'postgres', 'supersafepassword', {
    host: 'localhost',
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})

// Constant variables called throughout the programe
const port = 3000
const statesArray = ['Delivered', 'Pending', 'Returned']

/**
 * Question 4
 * Initial connection between sequelize and our postgress database
 *
 * @function authenticate 
 */

/**
 * Test the connection by trying to authenticate the connection
 * 
 * @returns {Promise} No returned objects
 */
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
        app.listen(port, () => console.log(`Example app listening on port ${port}!`))
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

/**
 * Define a new model, representing a table in the DB.
 * @param {string} 'product' - Name of the Table
 * @param {Object} attributes - Each attribute is a column in the table
 * @param {Object} options 
 * @description Specifies product Table.
 * 
 * @property {attribute} id: ID of the Product, Primary Key, and auto increment
 * @property {attribute} title: Title of the Product
 * @property {attribute} price: Price of the Product
 * @property {attribute} created_at: Auto timestamp upon creation
 * @property {attribute} deleted_at: Timestamp at deletion
 * @property {attribute} tags: SEO product tags
 */
const Products = sequelize.define('product', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
    },
    price: {
        type: Sequelize.FLOAT(10),
        validate:{
          isFloat: true,
          min: 0.0
        }
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: sequelize.fn('NOW')
    },
    deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
    }
}, {
    timestamps: false
})

// Product.create({
//   title: "New product"
//   price:  chance.floating({ min: 0, max: 999, fixed: 2 }),
//   tags: ['Tag1','Tag2','Tag3']
// }).then( users => {
//   users.save()
// }).catch(err => {
//   console.log(err)
// })

/**
 * Define a new model, representing a table in the DB.
 * @param {string} 'purchase_item' - Name of the Table
 * @param {Object} attributes - Each attribute is a column in the table
 * @param {Object} options 
 * @description Specifies product Table.
 * 
 * @property {attribute} id: ID of the Purchase_Item, Primary Key, and auto increment
 * @property {attribute} price: Price of the Purchase_Item
 * @property {attribute} quantity: Quantity amount of the Purchase_Item
 * @property {attribute} state: Delivery status of the Purchase_Item
 */
const Purchase_Item = sequelize.define('purchase_item', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    price: {
        type: Sequelize.FLOAT(10)
    },
    quantity: {
        type: Sequelize.INTEGER
    },
    state: {
        type: Sequelize.ENUM,
        values: statesArray
    }
}, {
    timestamps: false
})

// Purchase_Item.create({
//   price:  chance.floating({ min: 0, max: 999, fixed: 2 }),
//   quantity: chance.natural({min: 1, max: 10}),
//   state: getRandomState()
// }).then( users => {
//   users.save()
// }).catch(err => {
//   console.log(err)
// })

/**
 * Define a new model, representing a table in the DB.
 * @param {string} 'purchases' - Name of the Table
 * @param {Object} attributes - Each attribute is a column in the table
 * @param {Object} options 
 * @description Specifies purchases Table.
 * 
 * @property {attribute} id: ID of the Purchase, Primary Key, and auto increment
 * @property {attribute} name: Name of the product that has been Purchased
 * @property {attribute} addres: Address of the Purchase
 * @property {attribute} state: State of the Purchase
 * @property {attribute} zipcode: Zipcode of the Purchase
 * @property {attribute} user_id: Foreign Key to the purchasing User 
 */
const Purchases = sequelize.define('purchases', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    state: {
        type: Sequelize.STRING
    },
    zipcode: {
        type: Sequelize.STRING
    },
    created_at: {
        type: sequelize.fn('NOW'),
        defaultValue: sequelize.literal('NOW()')
    }
}, {
    timestamps: false
})

/**
 * Define a new model, representing a table in the DB.
 * @param {string} 'users' - Name of the Table
 * @param {Object} attributes - Each attribute is a column in the table
 * @param {Object} options 
 * @description Specifies users Table.
 * 
 * @property {attribute} id: ID of the User, Primary Key, and auto increment
 * @property {attribute} email: Email of the User, validated
 * @property {attribute} password: Password of the User
 * @property {attribute} details: Details of the User
 * @property {attribute} created_at: Auto timestamp upon creation
 * @property {attribute} deleted_at: Timestamp at deletion
 *
 * @property {attribute}
 */
const Users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: Sequelize.STRING
    },
    details: {
        type: Sequelize.STRING
    },
    created_at: {
        type: Sequelize.DATE,
        defaultValue: sequelize.literal('NOW()')
    },
    deleted_at: {
        type: Sequelize.DATE,
        defaultValue: null
    }
}, {
    timestamps: false,
})

// Users.create({
//   email:  chance.first() + '.' + chance.last() + chance.email({domain: 'gmail.com'}),
//   password: randomString(32),
//   details: 'sex=>' + chance.gender().charAt(0)
// }).then( users => {
//   users.save()
// }).catch(err => {
//   console.log(err)
// })

// Associations
// foreign id's will automatically be added
// We use hasOne to add the foreign id to the target model.(Model name before full-stop)
Purchases.belongsTo(Users, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})

Purchase_Item.belongsTo(Purchases,{
  foreignKey: {
    name: 'purchase_id',
    allowNull: false
  }
})

Purchase_Item.belongsTo(Products,{
  foreignKey: {
    name: 'product_id',
    allowNull: false
  }
})

// Users.create({
//     email: chance.first() + '.' + chance.last() + chance.email({ domain: 'gmail.com' }),
//     password: randomString(32),
//     details: 'sex=>' + chance.gender().charAt(0)
// }).then(users => {
//     Purchases.create({
//         name: users.get('email').match(/\w+.\w+/g)[0].replace('.',' '),
//         address: chance.address({ short_suffix: true }) + '.',
//         state: chance.state(),
//         zipcode: chance.zip(),
//         user_id: users.get('id')
//     }, {
//         include: Users
//     }).then(purchase => {
//         purchase.save()
//     }).catch(err => {
//         console.log(err)
//     })

//     users.save()
// }).catch(err => {
//     console.log(err)
// })

// Products.belongsTo(Purchase_Item)
// Purchases.belongsTo(Purchase_Item)
// Users.belongsTo(Purchases)

// Purchase_Item.hasOne(Products)
// Purchase_Item.hasOne(Purchases)


/** randomString
 *
 * @function
 * @return {string} - Random set of 36 characters
 */
function randomString(length) {
    return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
}

/** getRandomState
 *
 * @function
 * @return {string} - Randomly choosen delivery state
 */
function getRandomState() {
    return statesArray[Math.floor(Math.random() * myArray.length)]
}

/** GET all Products
 * Exprees /GET Route, pass the defined route and results to a callback function.
 *
 * @function get
 * @param {string} - 'purchases'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Query to the postgress database
 * localhost/product
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} result - the returned results from the previous DB query
 */
app.get('/product', function(req, res, next) {
    Products.findAll().then(Products => {
        res.send(Products);
    })
})

/** GET product by ID
 * Exprees /GET Route, pass the defined route and results to a callback function.
 *
 * @function get
 * @param {string} - 'purchases'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Query to the postgress database
 * localhost:/product/1
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} result - the returned results from the previous DB query
 */
app.get('/product/:id', function(req, res, next) {
    Products.findByPk(req.params.id).then(product => {
        res.send(product);
    })
})

// POST a new product instance
/**
 * Exprees /POST Route, pass the defined route and results to a callback function.
 * localhost:3000/product?title=New Product&price=9.9&tags=["foo","bar"]
 *
 * @function post
 * @param {string} - 'product'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Access the defined sequelize model and create a new row
 * 
 * @function create
 * @property title:
 * @property price:
 * @property tags:
 */

/** Query to the postgress database
 * The query results are passed to a create instance of the Product model
 * each required value is obtained from the req.query object
 * localhost:3000/product/?title=New Product&price=9.99&tags=["Tag1","Tag2","Tag3"]
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 */

/**
 * express().send()
 * 
 * @param {object} result - the returned results from the previous DB query
 */
app.post('/product', function(req, res) {
    Products.create({
        title: req.query.title,
        price: req.query.price,
        tags: JSON.parse(req.query.tags)
    }).then(users => {
        users.save()
        res.send('POST request successful')
    }).catch(err => {
        res.sendStatus(500)
        console.log(err)
    })
})

/** PUT will update an existing product by ID
 * Express /PUT Route, pass the defined route to a specific user id and results to a callback function.
 *
 * @function put
 * @param {string} - 'users/:id'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Access the defined sequelize model and update a row
 * 
 * @function update
 * @property title: Passed title to update
 * @property where: Passed ID of the product to be updated
 */

/**
 * Query to the postgress database with a specific ID
 * I used the middleware params object to access the passed ID value
 * localhost:3000/product/28?title=Super New Product
 * PUT request will update the product at the ID passed with the new title passed
 *
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 * 
 */

/**
 * express().send()
 * 
 * @param {object} err - Any possible error will be reported to the client
 */
app.put('/product/:id', function(req, res, next) {
    Products.update({
            title: req.query.title
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(
            res.send('PUT was successful')
        )
        .catch(err => {
            res.send(err)
        })
})
/** DELETE a product by ID
 * Express /DELETE Route, pass the defined route to a specific user id and results to a callback function.
 *
 * @function get
 * @param {string} - 'users/:id'.
 * @param {function(req, res, next)} callback - Middleware to execute on get requests to this api
 * 
 */

/**
 * Access the defined sequelize model and update a row
 * 
 * @function destroy
 * @property where: deletes a row where the param 'id' is matched
 */

/**
 * Query to the postgress database with a specific ID
 * I used the middleware params object to access the passed ID value
 * localhost:3000/product/28
 * 
 * @returns {Promise} A promise that returns data object of the resulting psql query if resolved
 * Or 
 */

/**
 * express().send()
 * 
 * @param {object} result - the returned results from the previous DB query
 */
app.delete('/product/:id', function(req, res, next) {
    Products.destroy({
        where: { id: req.params.id }
    }).then(
        res.send('deleted successfully a product with id = ' + req.params.id)
    ).catch(err => {
        res.send(err)
    })
})


/*
Users.findByPk(1).then(userData =>{
  Purchases.create({

    name: userData.get('email').match(/\w+.\w+/g)[0].replace('.', ' '),
    address: chance.address({ short_suffix: true }) + '.',
    state: chance.state(),
    zipcode: chance.zip(),
    user_id: userData.get('id')
}, {
    include: Users
}).then(purchase => {
    purchase.save()
}).catch(err => {
    console.log(err)
})
})
*/
