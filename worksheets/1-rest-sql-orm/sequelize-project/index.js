const express = require('express');
const sequelize = require('sequelize');
const models = require('./server/models/index');

const app = express();
const db = new sequelize('postgres://markbarrett:password@127.0.0.1:5432/lab1');

// Test the sequelize connection
db.authenticate().then(() => {
	console.log('Connection to database successful! :)');
}).catch(err => {
	console.log('Unable to connect to the database :( '+err);
})
const port = 3000;

app.listen(port, () => console.log(`Express, listening on port ${port}!`));

// Testing Users using model
app.get('/users', (req, res) => {
	models.users.findAll({}).then(function(users) {
		res.send(users);
	})
});

// Get user by ID
app.get('/users/:id', (req, res) => {
	models.users.findAll({
		where: {
			id: req.params.id
		}
	}).then(function(user) {
		res.send(user);
	})
})

// Get products
app.get('/products', (req, res) => {
	models.products.findAll({}).then(function(products) {
		res.send(products);
	}); 
})

// Get the products by id
app.get('/products/:id', (req, res) => {
	models.products.findAll({
		where: {
			id: req.params.id
		}
	}).then(function (products) {
		res.send(products);
	});
})

// Get the purchases
app.get('/purchases', (req, res) => {
	models.purchase_items.findAll({}).then(function(purchase_items) {
		res.send(purchase_items);
	})
})