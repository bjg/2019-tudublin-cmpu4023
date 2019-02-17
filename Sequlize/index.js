const Sequelize = require('sequelize');
const express = require('express');
const app = express();
app.use(express.urlencoded())
const port = 3000;



const sequelize = new Sequelize('pgguide', 'postgres', 'Waldo1997', {
    host: "localhost",
    dialect: 'postgres',
    define: {
        timestamps: false
    }
});