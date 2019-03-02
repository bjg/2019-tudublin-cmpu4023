const express = require('express');
const http = require('http');
const Sequelize = require('sequelize');
const app = express();

   //database
const db = require('../config/database');

const purchases = db.define('purchases',
{

    id:
    {
        type:Sequelize.INTEGER,
        primaryKey: true
    },

    created_at:
    {
        type:Sequelize.DATE
    },

    name:
    {
        type:Sequelize.STRING
    },

    address:
    {
        type:Sequelize.STRING
    },

   
    state:
    {
        type:Sequelize.STRING
    },

    zipcode:
    {
        type:Sequelize.STRING
    },

    user_id:
    {
        type:Sequelize.STRING
    }

})

    module.exports=purchases;
    