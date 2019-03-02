const express = require('express');
const http = require('http');
const Sequelize = require('sequelize');
const app = express();

   //database
const db = require('../config/database');

const purchase_items = db.define('purchase_items',
{

    id:
    {
        type:Sequelize.INTEGER,
        primaryKey: true
    },

    purchase_id:
    {
        type:Sequelize.INTEGER
    },

    product_id:
    {
        type:Sequelize.INTEGER
    },

    price:
    {
        type:Sequelize.FLOAT
    },

   
    quantity:
    {
        type:Sequelize.INTEGER
    },

    state:
    {
        type:Sequelize.STRING
    }

})

    module.exports=purchase_items;
    