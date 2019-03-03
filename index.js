const express = require("express");
const Sequelize = require("sequelize");
const app = express();
const port = 3000;

const sequelize = new Sequelize('postgres','postgres','jordan1',{
    host: 'localhost',
    dialect: 'postgres',
    operatorAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been establisted sucessfully');
    })
    .catch(err => {
        console.error('Unable to connect to the database: ', err);
    });

    app.get('/', (req, res) => res.send('Connection established, Please use an endpoint from the labsheet'));

    app.listen(port, () => console.log('App listening on port ${port}'));
