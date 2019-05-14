var express = require('express');
var app = express();
var massive = require('massive');
const Sequelize = require('sequelize');
const port = 3000;

const sequelize = new Sequelize('pgguide','postgres','password',{
	host: 'localhost'
	dialect: 'postgres'
	operatorAliases: false,
	define: {
		timestamps: false
	},
	pool: {
		max: 5,
		min, 0,
		acquire: 30000,
		idle: 10000
	}
});

sequelize.authenticate().then(() => {
	console.log('Connected');
}).catch(err => {
	console.error('Connection failed: ', err);
});

app.set('db', Sequelize);

module.exports = app;