const express = require('express');
const app = express();
const port = 3000;
const massive = require('massive');

massive({
	host: 'localhost',
	port: 5432,
	database: 'pgguide',
	user: 'daniel',
	password: 'brunomoloney'
}).then(instance => app.set("db", instance))

//1 get /users in order of recently created
app.get('/users', function(req, res) {
    req.app.get("db").query("SELECT email, details FROM users ORDER BY created_at DESC")
	.then(data => {
		res.json(data)
	});
});

//1 get /users/:id 
app.get('/users/:id', function(req, res) {
	req.app.get("db").query("SELECT email, details FROM users WHERE id =" + req.params.id)
	.then(data => {
		res.json(data)
	});
});

//1 get /products in ascending order of price
app.get('/products', function(req, res) {
	req.app.get("db").query("SELECT title, price FROM products ORDER BY price ASC")
	.then(data => {
		res.json(data)
	});
});


//1 get /products/:id
app.get('/products/:id', function (req, res) {
	req.app.get("db").query("SELECT title, price FROM products WHERE id =" + req.params.id)
	.then(data => {
		res.json(data)
	});
});


//1 get /purchases include receiver's name and, address, purchaser's email address and the price, quantity and delivery status of the purchased item. Order by price in descending order
app.get('/purchases', function(req, res) {
	req.app.get("db").query("SELECT purchases.name, purchases.address, U.email, P.price, P.quantity, P.state FROM purchases INNER JOIN users U on purchases.user_id = U.id INNER JOIN purchase_items P ON purchases.id = P.id ORDER BY price DESC")
	.then(data => {
		res.json(data)
	});
});


//2 get /products/?name= string but do it badly so sql can be injected
app.get('/productsInject', function(req, res) {
	req.app.get("db").query("SELECT * FROM products WHERE title = '" + req.query.name +"'")
	.then(data => {
		res.json(data)
	});
});


//3 address the security hole in the previous part using a parameterised query and stored proceedure using SQL or PLPGSQL 

//Parameterised query
app.get('/productsParameterised', function(req, res) {
	req.app.get("db").query("SELECT * FROM products WHERE title = ${name}",
		{ name: req.query.name, 
		})
	.then(data => {
		res.json(data)
	});
});


//Stored proceedure
app.get('/productsProcedure', (req, res) => {
	req.app.get("db").query("SELECT * FROM selectProducts(\'' + req.query.name + '\');")
	.then(data => {
		res.json(data)
	});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));