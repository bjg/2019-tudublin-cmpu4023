const express = require('express');
const http = require('http');
const Sequelize = require('sequelize');
const app = express();
const path = require('path');

   //database
const db = require('../config/database');

const users = db.define('users',
{

    id:
    {
        type:Sequelize.INTEGER,
        primaryKey: true
    },

    email:
    {
        type:Sequelize.STRING
    },

    password:
    {
        type:Sequelize.STRING
    },

    details:
    {
        type:Sequelize.STRING
    },

    created_at:
    {
        type:Sequelize.DATE
    },

    deleted_at:
    {
        type:Sequelize.DATE
    },

     
    
})
    
    module.exports=users;
    