const express = require('express');
const http = require('http');
const Sequelize = require('sequelize');
const app = express();
const path = require('path');

   //database
const db = require('../config/database');

const products = db.define('products',
{

    id:
    {
        type:Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    title:
    {
        type:Sequelize.STRING
    },

    price:
    {
        type:Sequelize.FLOAT
    },

    created_at:
    {
        type:Sequelize.DATE
    },

   
    deleted_at:
    {
        type:Sequelize.DATE
    },

    tags:
    {
        type:Sequelize.HSTORE
    }

})

    module.exports=products;
    