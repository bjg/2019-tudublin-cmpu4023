var Sequelize = require('sequelize');

var connection = new Sequelize('pgguide', 'usr', 'password', {
    host: 'localhost',
    dialect: 'postgres'
})