const express = require('express');
const http = require('http');
const massive = require('massive');

const app = express()
const port = 3000


massive({
	host: '127.0.0.1',
	port: 5432,
	database: 'pgguide',
	user: 'pgpaul',
	password: 'password'
}).then(instance => {
	app.set('db', instance);

//********************************************************************************
app.get('/', (req, res) => res.send('Lab1'))
//********************************************************************************

// Get all users
  app.get("/users", (req, res) => {
  		instance.query("SELECT email, details->'sex' as sex FROM users ORDER BY created_at DESC").then(query => {
			res.json(query);
		})
});


//********************************************************************************

// Get a specific user
	app.get("/users/:id", (req, res) => {
		instance.query("select email, details->'sex' as sex from users where id = ${id} order by created_at DESC",
		{id: req.params.id}).then(query => {
		res.json(query);
	})
});


//********************************************************************************

// Get all products
//	app.get('/products', (req, res) => {
//	instance.query( "Select * from products order by price ASC").then(items => {
//	res.json(items);
//	});
//});

// ---------------------
//   SQL injection code 
// ---------------------

//http://127.0.0.1:3000/products?name=p
//http://127.0.0.1:3000/products?name=p%27%3B%20SELECT%20*%20FROM%20purchase_items%3B%20--
//http://127.0.0.1:3000/products?name=p%27%3BDELETE%20FROM%products%20WHERE%20product_id=1000%3B%22-- ; 

 app.get('/products', (req, res) => {			
	search = (req.query.name == undefined) ? '' : req.query.name;
	instance.query("SELECT * FROM products WHERE LOWER(title) LIKE '" + search + "%' " + 
	"ORDER BY price ASC").then(items => {
	res.json(items);
		});

// --------------------------------------------------------------
//Using a parameterised query to eliminate the SQL Injection posibilities
// ---------------------------------------------------------------

//		app.get('/products', (req, res) => {
//		search = (req.query.name == undefined) ? '' : req.query.name;
//		instance.query("SELECT * FROM products WHERE LOWER(title) LIKE $1 " + 
//		"ORDER BY price ASC", [ search + "%" ]).then(items => {
//		res.json(items);
//			 });
//		});

//--------------------------------------------------------------
//Using a stored procedure to eliminate the SQL Injection
//--------------------------------------------------------------

//	app.get("/products", (req, res) => {
//	instance.query('select * from products(${title})', {title: req.query.name}).then(query => {
//		res.json(query);
//	});
//});


//********************************************************************************

 // Get product by id
//	app.get("/products/:id", (req, res) => {
//		instance.query("select * from products where id = ${id}",
//		{id: req.params.id}).then(query => {
//		res.json(query);
//	})
//});


//********************************************************************************

// Get purchases
	app.get("/purchases", (req, res) => {
		instance.query("select purchases.name, purchases.address, users.email, purchase_items.price, purchase_items.quantity," 
		+ " purchase_items.state from purchases join users on purchases.user_id = users.id "
		+ "join purchase_items on purchases.id = purchase_items.purchase_id order by purchase_items.price DESC").then(query => {
		res.json(query);
	})
});


//********************************************************************************

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


});




