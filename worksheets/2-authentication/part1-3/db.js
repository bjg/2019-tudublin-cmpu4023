const express = require('express');
var app = express();
const Sequelize = require('sequelize');

const sequelize = new Sequelize('lab2', 'admin1', 'password', {
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

sequelize
  .authenticate().then(() => {
    console.log('you are connected to the database');
  }).catch(err => {
    console.error('error connecting to database:', err);
  });

app.set('db', sequelize);

module.exports = app;
