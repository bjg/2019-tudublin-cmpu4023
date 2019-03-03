const Sequelize = require('sequelize');
const dbObj = require('../db');
const db = dbObj.get('db');
const express = require('express');
var app = express();

const Products = db.define('products', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    title: {
        type: Sequelize.STRING
    },
    price: {
        type: Sequelize.NUMERIC
    }
});

app.set('Products', Products);
module.exports = app;
