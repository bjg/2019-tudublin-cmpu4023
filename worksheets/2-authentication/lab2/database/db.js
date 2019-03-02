//////////// Database object creating ///////////////
const express = require('express');
var app = express();
const Sequelize = require('sequelize');

//DB instance
const sequelize = new Sequelize('lab2', 'postgres', 7512, {
  host: 'localhost',
  dialect: 'postgres',
  operatorsAliases: false,
  define: {
    timestamps: false
},

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

//4.1 test connection - verify we have connection
sequelize
  .authenticate().then(() => {
    console.log('connected to database !');
  }).catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.set('db', sequelize);

module.exports = app;