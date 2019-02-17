var express = require('express');
var app = express();
var massive = require("massive");
const Sequelize = require("massive");
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

massive({
	host: 'localhost',
	port: 5432,
	database: 'pgguide',
	user: 'postgres',
	password: '',
	ssl: false,
	poolSize: 10,
}).then(db => {

app.get('/', function(req, res) {
    res.send('Return JSON or HTML View');
});

// Q1.1 - GET /users
app.get('/users', (req, res) => {
	db.query("Select email, details -> 'sex' from users order by created_at desc").then(users => {
	res.send(users);
	});
});

// Q1.2 - GET /users/:id
app.get('/users::id', function(req, res) {
    db.query("Select email, details -> 'sex' from users where id = 1").then(users => {
	  res.send(users);
    });
});

// Q1.3 - GET /product
app.get('/product', (req, res) => {
	db.query("Select * from products order by price").then(products => {
	res.send(products);
	});
});

// Q1.4 - GET /products/:id
app.get('/products::id', function(req, res) {
    db.query("Select * from products where id = 1").then(products => {
	  res.send(products);
    });
});

// Q1.5 - GET /purchases
app.get('/purchases', (req, res) => {
	db.query("Select purchases.name, purchases.address, users.email, purchase_items.price, purchase_items.quantity, purchase_items.state from purchase_items join purchases on purchase_items.id=purchases.id join users on purchases.id=users.id order by price DESC").then(purchases => {
	res.send(purchases);
	});
});

// Q2 - GET /products[?name=string]
app.get('/products', function(req, res){
	var query = req.query.title;
	db.query("Select * from products where title = " + query).then(products => {
	res.send(products);
	});
});

// Q3.1 - GET /products_param[?name=string]
app.get('/products_param', function(req, res){
	var query = req.query.title;
	db.query("Select * from products where title = " + query + "or 1=1").then(products => {
	res.send(products);
	});
});


app.listen(port, () => console.log('Example app listening on port 3000!'))});