const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/pgguide');
const Op = Sequelize.Op;
var express = require('express');
var app = express();
const port = 3000;
const users = sequelize.import("models/users")
const products = sequelize.import("models/products")
const purchases = sequelize.import("models/purchases")
const purchase_items = sequelize.import("models/purchase_items")

app.get('/', function(req, res) {
	res.send('Return JSON or HTML View');
});

// Q1 - GET /users
app.get('/users', (req, res) => {
	users.findAll({attributes:['id', 'email', 'details']}).then(users => {
		res.json(users)
	});
});

// Q6.1 - GET /products[?name=string]
app.get('/products', (req, res) => {
	var name = req.query.name;
	products.findOne({
		where: {
			title: name
		}
	}).then(products => {
		res.json(products)
	});
});


// Q6.2 - GET /products/id
app.get('/products/:id', (req, res) => {
	var id = req.params.id;
	products.findById(id).then(products => {
		res.json(products)
	});
});

// Q6.3 - POST /products
app.post('/products', (req, res) => {
	products.create({
		title: 'test',
		price: 10.5,
		created_at: new Date(),
		tags: ['test']
	}).then(products => {
		res.json(products)
	});
});

// Q6.4 - PUT /products/id
app.put('/products/:id', (req, res) => {
	let id = req.params.id;
	products.find({
		where: {
			id: id
		}
	}).then(products => {
		return products.updateAttributes({title: 'updated title'})
	}).then(updatedProducts => {
			res.json(updatedProducts);
	});
});

// Q6.5 - DELETE /products/id
app.delete('/products/:id', (req, res) => {
	let deleteId = req.params.id;
	products.destroy({
		where: {
			id: deleteId}
		}).then(products => {
		res.json(products)
	});
});

app.listen(port, () => console.log(`Sequelize CRUD listening on port ${port}!`))