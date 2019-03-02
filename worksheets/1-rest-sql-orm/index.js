var express = require('express');
var app = express();
var massive = require("massive");
const port = 3000;

massive({
	host: 'localhost',
	port: 5432,
	database: 'pgguide',
	user: 'postgres',
	password: 'postgres',
	ssl: false,
	poolSize: 10,
}).then(db => {

	// Q1 - GET /users
	app.get('/users', (req, res) => {
		db.query("select email, details -> 'sex' as sex from users order by created_at DESC").then(users => {
		  res.send(users);
		});
	});

	// Q2 - GET /users/id
	app.get('/users/:id', (req, res) => {
		var id = req.params.id;
		db.query("select email, details -> 'sex' as sex from users where id = " + id).then(users => {
		  res.send(users);
		});
	});

	// Q3 - GET /products
	/*app.get('/products', (req, res) => {
		console.log("wrong")
		db.query("select * from products order by price asc").then(products => {
		  res.send(products);
		});
	});*/

	// Q4 - GET /products/id
	app.get('/products/:id', (req, res) => {
		var id = req.params.id;
		db.query("select * from products where id = " + id).then(products => {
		  res.send(products);
		});
	});

	// Q5 - GET /purchases
	app.get('/purchases', (req, res) => {
		db.query(`SELECT ps.name, ps.address, us.email, psi.price, psi.quantity, psi.state 
				  FROM purchases ps 
				  INNER JOIN purchase_items psi ON psi.purchase_id = ps.id 
				  INNER JOIN users us ON ps.user_id = us.id ORDER BY psi.price DESC`).then(purchases => {
		  res.send(purchases);
		});
	});
	
	// Part 2 GET /products[?name=string]
	app.get('/products', (req, res) => {
		var name = req.query.name
		if(name == null){
			db.query("select * from products order by price asc").then(products => {
				res.send(products);
			});
		}
		else{
			db.query("select * from products where title = '" + name + "'").then(products => {
				res.send(products);
			});
		}
	});	
	
	app.get('/prepped', (req, res) => {
		var name = req.query.name
		console.log(name)
		db.query(`select * from products where title = ${name};`).then(products => {
			res.send(products);
		});
	});
	
	app.get('/sqlinjection', (req, res) => {
		var name = req.query.name
		db.query(`select sqlinjection(${name})`).then(products => {
			res.send(products);
		});
	});
});

app.listen(port, () => console.log(`Problem set one listening on port ${port}!`))