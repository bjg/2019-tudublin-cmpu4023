const express = require('express');
const sequelize = require('sequelize');
const models = require('./server/models/index');
const bodyParser = require('body-parser');

const app = express();
const db = new sequelize('postgres://markbarrett:password@127.0.0.1:5432/lab1');

// Tell Express to use BodyParser
app.use(express.json());
app.use(express.urlencoded());

// Test the sequelize connection
db.authenticate().then(() => {
	console.log('Connection to database successful! :)');
}).catch(err => {
	console.log('Unable to connect to the database :( '+err);
})
const port = 3000;

app.listen(port, () => console.log(`Express, listening on port ${port}!`));

/* RE IMPLEMENTING SOME OF THE PREVIOUS ENDPOINTS AND SOME NEW ONES! */
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
	if(req.query.name) {
		models.products.findAll({
			where: {
				title: req.query.name
			}
		}).then(function (products) {
			res.send(products);
		}); 
	} else {
		models.products.findAll({}).then(function (products) {
			res.send(products);
		}); 
	}
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

// POST for creating a new product instance
app.post('/products', (req, res) => {
	// Check to make sure the required things are valid
	if(req.body.hasOwnProperty('title') && req.body.hasOwnProperty('price') && req.body.hasOwnProperty('tags')) {
		// Now create the product
		var product = models.products.build({
			title: req.body.title,
			price: req.body.price,
			// Split the tags into an array from a string sent as a parameter
			tags: req.body.tags.split(','),
			created_at: new Date(Date.now()).toISOString()
		});
		
		// If successful then say so, if not return the error
		product.save().then(() => {
			res.send('[SUCCESS]: Product created successfully.');
		}).catch(error => {
			res.send('[ERROR]: '+error);
		})
	} else {
		// The right parameters weren't sent.
		res.send('[ERROR]: To create a product, there must be a title, price and tags.');
	}
})

// Put to update product model instance
app.put('/products/:id', (req, res) => {
	// Check the id
	if(req.params.id) {
		// Find the product
		models.products.find({
			where: {
				id: req.params.id
			}
		}).then((product) => {
			// Found the product, check to see if each key is in the sent param, if so then update that value.
			if(req.body.hasOwnProperty('title')) {
				product.update({
					title: req.body.title
				}).then(() => {
					res.send('[SUCCESS]: Product updated successfully.')
				})
			}
			if(req.body.hasOwnProperty('price')) {
				product.update({
					price: req.body.price
				}).then(() => {
					res.send('[SUCCESS]: Product updated successfully.')
				})
			}
			if(req.body.hasOwnProperty('tags')) {
				product.update({
					tags: req.body.tags.split(','),
				}).then(() => {
					res.send('[SUCCESS]: Product updated successfully.')
				})
			}

		}).catch((error) => {
			res.send('[ERROR]: '+error);
		})
	} else {
		res.send('[ERROR]: ID of product needed to PUT.')
	}
});

app.delete('/products/:id', (req, res) => {
	// Get the product
	models.products.find({
		where: {
			id: req.params.id
		}
	}).then((product) => {
		// If its found, destroy it
		product.destroy().then(() => {
			// If destroyed then return success
			res.send('Product deleted successfully!');
		}).catch((error) => {
			// If failed then return that
			res.send('[ERROR]: '+error);
		})
	}).catch((error) => {
		// If the product cannot be found.
		res.send('[ERROR]: '+error);
	})
});

// Get the purchases
app.get('/purchases', (req, res) => {
	models.purchases.findAll({
		include: [
			{model:models.users},
			{model:models.purchase_items}
		]
	}).then(function(purchase_items) {
		res.send(purchase_items);
	})
})