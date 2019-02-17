const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const path = require('path');

let urlencodedParser = bodyParser.urlencoded({ extended: false});

const Sequelize = require('sequelize');
const sequelize = new Sequelize('pgguide', 'ycc', 'toor1234', {
	host: 'localhost',
	dialect: 'postgres',
	define: {
        timestamps: false
    },
	operatorsAliases: false,

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

//Checking connection
sequelize.authenticate().then(() => {
		console.log('Connection has been established successfully.');
	}).catch(err => {
		console.error('Unable to connect to the database:', err);
	});

//Creating models
const User = sequelize.define('user', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
        autoIncrement: true
	},
	name: {
		type: Sequelize.STRING
	},
	gender: {
		type: Sequelize.STRING
	},
	email: {
		type: Sequelize.STRING
	},
	age: {
		type: Sequelize.INTEGER
	}
});

const Product = sequelize.define('product', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
        autoIncrement: true
	},
	title: {
		type: Sequelize.STRING
	},
	price: {
		type: Sequelize.STRING
	},
	created_at: {
		type: Sequelize.DATE
	},
	deleted_at: {
		type: Sequelize.DATE
	},
	tags: {
		type: Sequelize.ARRAY(Sequelize.TEXT(255))
	}
});

const Purchase = sequelize.define('purchase', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
        autoIncrement: true
	},
	created_at: {
		type: Sequelize.DATE
	},
	name: {
		type: Sequelize.STRING(255)
	},
	address: {
		type: Sequelize.STRING(255)
	},
	state: {
		type: Sequelize.STRING(2)
	},
	zipcode: {
		type: Sequelize.STRING
	},
	user_id: {
		type: Sequelize.INTEGER
	}
});

const Purchase_item = sequelize.define('purchase_item', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
        autoIncrement: true
	},
	purchase_id: {
		type: Sequelize.INTEGER
	},
	product_id: {
		type: Sequelize.INTEGER
	},
	price: {
		type: Sequelize.NUMERIC
	},
	quantity: {
		type: Sequelize.INTEGER
	},
	state: {
		type: Sequelize.STRING(255)
	}
});

setTimeout(function () {
//////// Inserting test data
	// User.build({
	// 	name: 'Jane',
	// 	gender: 'Female',
	// 	email: 'jane@gmail.com',
	// 	age: 35
	// }).save().then(user => {
	// 	console.log("User: " + user + " added.");
	//   })
	//   .catch(error => {
	// 	console.log(error);
	// });

	// Product.build({
	// 	title: 'Smartphone',
	// 	price: 549.99,
	// 	created_at: sequelize.fn('NOW'),
	// 	deleted_at: null,
	// 	tags: ['Android', 'Mobile', 'Phone']
	// }).save().then(product => {
	// 	console.log("Product: " + product + " added.");
	//   })
	//   .catch(error => {
	// 	console.log(error);
	// });

	// Purchase.build({
	// 	created_at: sequelize.fn('NOW'),
	// 	name: 'Jane Clark',
	// 	address: '123 Ave.',
	// 	state: 'NY',
	// 	zipcode: 12344,
	// 	user_id: 14
	// }).save().then(purchase => {
	// 	console.log("Purchase: " + purchase + " added.");
	//   })
	//   .catch(error => {
	// 	console.log(error);
	// });

	// Purchase_item.build({
	// 	purchase_id: 1002,
	// 	product_id: 21,
	// 	price: 549.99,
	// 	quantity: 1,
	// 	state: 'Pending'
	// }).save().then(purchase_item => {
	// 	console.log("Purchase_item: " + purchase_item + " added.");
	//   })
	//   .catch(error => {
	// 	console.log(error);
	// });
}, 2000)


app.get('/', (req, res) => res.send('RESTful API - Express & Sequelize<br>\
	GET /products[?name=string] - List all products<br>\
	GET /products/:id - Show details of the specified products<br>\
	POST /products - Create a new product instance<br>\
	PUT /products/:id - Update an existing product<br>\
	DELETE /products/:id - Remove an existing product<br>\
	'
));

// show products
app.get('/products', (req, res) => {
	if(Object.keys(req.query).length === 0 && req.query.constructor === Object) {
		res.sendFile(path.join(__dirname+'/create_product.html'));
	}
	else {
		let title = req.query.name;
		sequelize.query("SELECT * FROM products where LOWER(title)=LOWER('" + title+ "')", { type: sequelize.QueryTypes.SELECT}).then(products => {
			if (Object.keys(products).length === 0) {
				res.status(404).send(`No product with name: ${req.query.name}`);
			}
			else {
				res.send(products);
			}
		});
	}
});

// Add product
app.post('/products', urlencodedParser, (req, res) => {
	Product.build({
			title: req.body.title,
			price: parseFloat(req.body.price),
			created_at: sequelize.fn('NOW'),
			deleted_at: null,
			tags: req.body.tags.split(" ")
		}).save().then(product => {
			console.log("Product: " + product + " added.");
		})
		  .catch(error => {
			console.log(error);
		});
	res.redirect('/products')
});

// Delete product
app.delete('/products/:id', urlencodedParser, (req, res) => {
	console.log("DELETE CALLED")
	Product.destroy({
		where: {
			id: parseInt(req.params.id)
		}
	}).then(() => {
		res.send('Product with id: ' + req.params.id + ' successfully deleted.')
	}).catch(err => {
		console.error('Unable to delete', err);
	});
});

app.get('/products/:id', (req, res) => {
	Product.findOne({
		where: {
			id: parseInt(req.params.id)
		}
	}).then(product => {
		res.render(path.join(__dirname+'/product.ejs'), {product: product});
	})
});

//Update product
app.put('/products/:id', (req, res) => {

});


app.listen(port, () => console.log(`REST API app listening on port ${port}!`));