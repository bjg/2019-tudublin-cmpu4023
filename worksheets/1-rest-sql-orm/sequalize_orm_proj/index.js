const express = require('express')
const app = express()
const port = 3000
const path = require('path');

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

const bodyParser = require('body-parser')
let urlencodedParser = bodyParser.urlencoded({ extended: false});

const Sequelize = require('sequelize');
const sequelize = new Sequelize('pgguide', 'postgres', 'Flamingmarshmallow97', {
	host: 'localhost',
	dialect: 'postgres',
	define: {
        timestamps: false
    },
	operatorsAliases: false,

	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
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

// Base Route, and further routing instructions
app.get('/', (req, res) => res.send('RESTful API - Express & Sequelize<br>\
	GET /products[?name=string] - List all products<br>\
	GET /products/:id - Show details of the specified products<br>\
	POST /products - Create a new product instance<br>\
	PUT /products/:id - Update an existing product<br>\
	DELETE /products/:id - Remove an existing product<br>\
	'
));

// List all products
app.get('/products', (req, res) => {
	let title = req.query.name;
	sequelize.query("SELECT * FROM products where LOWER(title)=LOWER('" + title+ "')", { type: sequelize.QueryTypes.SELECT}).then(products => {
		if (Object.keys(products).length === 0) {
			res.status(404).send(`No product with name: ${req.query.name}`);
		}
		else {
			res.send(products);
		}
	});
});

// Show details of the specified products
app.get('/products/:id', (req, res) => {
Product.findAll({
	where: {
		id: req.params.id
	}
	}).then(product => {
		return res.json(product);
	});
});

// Add product
app.get('/add_products', (req, res) => {
	res.sendFile(path.join(__dirname+'/add_products.html'));
});


app.post('/add_products', urlencodedParser, (req, res) => {
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
	res.redirect('/products?name=' + title)
});
