var express = require('express');
var app = express();
var massive = require("massive");
const Sequelize = require("sequelize");
const port = 3000;

const sequelize = new Sequelize('pgguide','postgres','password', {
	host: 'localhost',
	dialect: 'postgres',
	operatorsAliases: false,
	define: {
		timestamps: false
},

    pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
});

sequelize
   .authenticate().then(() => {
	   console.log('connected to pgguide');
   }).catch(err => {
	   console.error('failed to connect to:',err);
   });
   
app.set('db', Sequelize);

module.exports = app;


massive({
	host: 'localhost',
	port: 5432,
	database: 'pgguide',
	user: 'postgres',
	password: 'password',
	ssl: false,
	poolSize: 10,
}).then(db => {

app.get('/', function(req, res) {
    res.send('Return JSON or HTML View');
});

//******Q1*******
// 1 - GET /users
	app.get('/users', (req, res) => {
		db.query("select email, details -> 'sex' from users order by created_at DESC").then(users => {
		  res.send(users);
		});
	});

//2 - GET /users/:id
    app.get('/users/::id',function(req, res){
		let id = req.params.id;
		db.query("select email, details -> 'sex' from users where id = " + id).then(users => {
		  res.send(users);
		});
	});
	
//3 - GET /products
    app.get('/products',function(req, res){
		let id = req.params.id;
		db.query("select id, title, price from products order by price").then(products => {
		  res.send(products);
		});
	});
	
//4 - GET /products/:id
    app.get('/products/::id',function(req, res){
		let id = req.params.id;
		db.query("select * from products where id = 1").then(products => {
		  res.send(products);
		});
	});
	
//5 - GET /purchases
app.get('/purchases', (req, res) => {
	db.query("Select purchases.name, purchases.address, users.email, purchase_items.price, purchase_items.quantity, purchase_items.state from purchase_items join purchases on purchase_items.id=purchases.id join users on purchases.id=users.id order by price DESC").then(purchases => {
	res.send(purchases);
	    });
   });

//*******Q2*********
//- GET /products[?name=string]
    app.get('/products',function(req, res){
		var query = req.query.title;
		db.query('select * from products where title = '+ query).then(products => {
		  res.send(products);
		});
	});
	
//*******Q3*********
//parameterised query

 app.get('/products/parameterised',function(req, res){
		var query = req.query.title;
		db.query('select * from products where title = $1 ', [req.query.title]).then(products => {
		  res.send(products);
		});
	});
//*****Q5******


//*******Q5**********
var users = db.users;

app.post('/users',function(req,res) {
	users.create({
		email: req.body.email,
		password:req.body.password,
		details:req.body.details
		})
		 .then(function (users){
			 res.json(users);
		 });
});
    





app.listen(port,() =>
console.log('Example app listening on port 3000!'))});


