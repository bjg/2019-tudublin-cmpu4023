const express = require('express')
const app = express()

/*
Part 4 
Create Sequalize migrations for the ​ pgguide​ sample database
*/
const Sequelize = require('sequelize');
const DataTypes = require('sequelize/lib/data-types');
const sequelize = new Sequelize('pgguide', 'ronan', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
});


const User = sequelize.define('user', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },
    details: {
        type: Sequelize.STRING
    },
    created_at: {
        type: Sequelize.DATE
    },
    deleted_at: {
        type: Sequelize.DATE
    }
},{
  timestamps: false 
});



const Purchase = sequelize.define('purchase', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    created_at: {
        type: Sequelize.STRING
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
        type: Sequelize.INTEGER
    },
    user_id: {
        type: Sequelize.INTEGER
    },
},{
  timestamps: false 
});


const PurchaseItem = sequelize.define('purchase_item', {
    purchase_id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    name: {
      type: Sequelize.STRING
    },
    address: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.STRING
    },
    quantity: {
        type: Sequelize.INTEGER
    }
},{
  timestamps: false 
});


const Product = sequelize.define('product', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    title: {
        type: Sequelize.STRING
    },
    price: {
      type: Sequelize.STRING
    },
    created_at: {
        type: Sequelize.STRING
    },
    deleted_at: {
        type: Sequelize.STRING
    },
    tags: {
        type: Sequelize.ARRAY(DataTypes.TEXT)
    }
},{
  timestamps: false 
});


User.findAll().then(users => {
    console.log(users);
  }).catch(err => {
    console.error(err);
});

/*
Part 5
Use your models and Javascript code to populate the database with some
additional test data for all of the models above

*/

/*
Part 6
Reimplement the RESTful API using Sequelize and Express for your system.
Your API should support the following CRUD operations as follows, returning
JSON responses

GET /products[?name=string] List all products
GET /products/:id Show details of the specified products
POST /products Create a new product instance
PUT /products/:id Update an existing product
DELETE /products/:id Remove an existing product
*/