/* Js file that contains the code to complete the problem sets
	responses returned as JSON responses 
*/


const express = require('express');
const sequelize = require('sequelize');
const models = require('./models/index');
const bodyParser = require('body-parser');

const app = express();
const db = new sequelize('postgres://ashleyfitzgerald:ashleymark@127.0.0.1:5432/pgguide');

app.use(express.json());
app.use(express.urlencoded());

//check connection to postgres database
db.authenticate().then(() => {
	console.log('Connection to database successful! :)');
}).catch(err => {
	console.log('Unable to connect to the database :( '+err);
})
const port = 3000;

app.listen(port, () => console.log(`Express, listening on port ${port}!`));


//**Part 1*** show all of the products
app.get('/products', (req, res) => {
	models.products.findAll({}).then(function(products) {
		res.send(products);
	})
});

//**Part 2*** sget products by id
app.get('/products/:id', (req, res) => {
	models.products.findAll({
		//getting id as parameter
		where: {id: req.params.id}
	}).then(function (products) {
		res.send(products);
	});
})

//**Part 3*** now lets create a new product instance i will use post: and build and save functions
app.post('/products', (req, res) => {

		var newProduct = models.products.build({
			id: req.body.id,title: req.body.title,price: req.body.price,tags: req.body.tags.split(','), created_at: new Date(Date.now()).toISOString()
		});
		newProduct.save().then(() => {
			console.log('New product created and saved!!');
		})
	
})


//**Part 4*** now lets update product instance after user types in id. i will use put: and set function
app.put('/products/:id', (req, res) => {
	//finding product based on id
	models.products.find({
		where:{	id:req.params.id}

	//then updating given product
	}).then((product) => {
			product.set({title:req.body.title,price:req.body.price,tags:req.body.tags.split(',')})
	}).then(() => {
		console.log('product updated and saved and saved!!');
	})
})

//**Part 5*** now lets delete a product based on instances id. i will use delete: and destroy function
app.delete('/products/:id', (req, res) => {
	
	//finding product based on id
	models.products.find({
		where:{	id:req.params.id}
	
	//then destroying(deleting) given product
	}).then((product) => {
			product.destroy({i_id: req.params.user_id})
	}).then(() => {
		console.log('product deleted!');
	})
})



