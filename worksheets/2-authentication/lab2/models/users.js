const Sequelize = require('sequelize');
const dbObj = require('../database/db');
const db = dbObj.get('db');
const express = require('express');
var app = express();

const User = db.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING
    },
    password: {
        type: Sequelize.STRING
    },  accesskey: {
        type: Sequelize.STRING
    },
    secretkey: {
        type: Sequelize.STRING
    }
});

app.set('Users', User);
module.exports = app;
