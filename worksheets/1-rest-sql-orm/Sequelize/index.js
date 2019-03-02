const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const port = 3000;

var db = require('./models');
var Products = db.products;

//********************************************************************************
//Body parser used to get json from requests
app.use(bodyParser.json());

app.get('/', (req, res) => {

	res.send('Lab1');
});

//********************************************************************************

// Get all products or a single product
app.get('/products', (req,res) => {

	const name = req.query.name;

	if(typeof name === 'undefined'){
		Products.findAll().then(results => {
			res.json(results);
		}).catch(error => {
			console.error(error);
			res.send("Error occurred, try again!");
		});
	}

	else{
		Products.findAll({
			where: { title: name }
		}).then(results => {
			res.json(results);
		}).catch(error => {
			console.error(error);
		res.send("Error occurred, try again!");
		});
	}
});

//********************************************************************************

// Get product by id
app.get('/products/:id', (req, res) => {

	Products.findAll({
		where: { id: req.params.id }
	}).then(results => {
		res.json(results);
	}).catch(error => {
		console.error(error);
	res.send("Error occurred, try again!");
	});
});

//********************************************************************************

// Create a product
app.post('/products', (req, res) => {

	Products.create(req.body).then( results => {
		if (results._options.isNewRecord && results.dataValues.id > 0){
			res.send("Product created with id: " + results.dataValues.id);
		}
		else{
			res.send("Product not created");
		}
	}).catch( error => {
		console.error(error);
		res.send("Error occurred, try again!");
	});
});

//********************************************************************************

// Update a product
app.put('/products/:id', (req, res) => {

	Products.update(req.body, {
		where: {
			id: req.params.id
		}
	}).then( rowsAffected => {
		if (rowsAffected > 0){
			res.send("Product updated successfully");
		}
		else{
			res.send("Product not updated");
		}
	}).catch(error => {
		console.error(error);
		res.send("Error occurred, try again!");
	});
});

//********************************************************************************

// Delete a product
app.delete('/products/:id', (req,res) => {
	Products.destroy({
		where: {
			id: req.params.id
		}
	}).then(rowsAffected => {
		if (rowsAffected > 0){
			res.send("Product deleted successfully");
		}
		else{
			res.send("Product not deleted");
		}
	}).catch(error => {
		console.error(error);
		res.send("Error occurred, try again!");
	});
});

//********************************************************************************

// setup server
app.listen(port, () => {
		db.sequelize.sync();
});
