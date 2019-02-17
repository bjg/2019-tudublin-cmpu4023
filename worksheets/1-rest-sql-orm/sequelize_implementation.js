const express = require('express');
const http = require('http');
const Sequelize = require('sequelize');

const app = express();
const sequelize = new Sequelize('postgres:localhost:5432/pgguide');

sequelize.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
});



http.createServer(app).listen(3000);
