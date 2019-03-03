/*
Student Number: C15440858
Module: Enterprise Application Development
Lab: 1
*/

//Requirements.
const express = require('express')
const massive = require('massive')
const bluebird = require('bluebird')
const monitor = require('pg-monitor')

const app = express()
const port = 3000

massive(`postgres://postgres:admin@localhost:5432/pgguide`).then(db => {
  monitor.attach(db.driverConfig);

var connectionString = "postgres://massive:admin@localhost/chinook";



///Question 1
//GET /users
app.get('/users', (req, res, next) => 
{
	const query = "SELECT email, details->'sex' AS SEX, created_at FROM users ORDER BY created_at DESC"
	db.query(query).then(result => 
	{
		res.json(result);
	});
});

//GET /users/:id
app.get('/users/:id', (req, res, next) => 
{
	const id = req.params.id
	const query = "SELECT email, details->'sex' AS SEX, created_at FROM users " + "where ID = " + id.toString() + " ORDER BY created_at DESC"
	db.query(query).then(result => 
	{
		res.json(result);
	});
});

//GET /products
app.get('/products', (req, res, next) => 
{
	const query = "SELECT * FROM products ORDER BY price ASC"
	db.query(query).then(result => 
	{
		res.json(result);
	});
});

//GET /products/:id
app.get('/products/:id', (req, res, next) => 
{
	const id = req.params.id
	const query = "SELECT * FROM products " + "where ID = " + id.toString() + " ORDER BY price ASC"
	
	db.query(query).then(result => 
	{
		res.json(result);
	});
});

//GET /purchases
app.get('/purchases', (req, res, next) => 
{
	const query = `SELECT purchases.name,
	purchases.address,
	purchases.state,
	purchases.zipcode,
	users.email,
	products.title,
	purchase_items.price,
	purchase_items.quantity,
	purchase_items.state AS delivery_status
	FROM purchase_items 
	INNER JOIN purchases ON purchase_items.purchase_id = purchases.id 
	INNER JOIN users ON purchases.user_id = users.id 
	INNER JOIN products ON purchase_items.product_id = products.id 
	ORDER BY purchase_items.price DESC`
	db.query(query).then(result => 
	{
		res.json(result);
	});
});



///Question 2
//SQL Injection
app.get('/sql_injection/:name', (req, res, next) => 
{
	const query = "SELECT * FROM PRODUCTS where title = '" + req.params.name + "'"
	db.query(query).then(result => 
	{
		res.json(result);
	});
	
	//localhost:3000/sql_injection/'; DELETE from products where id = 30 OR title = '    -- This will allow any user to delete data through SQL injection.
});



///Question 3.
//Prepared Statement
app.get('/prepared_statement/:name', (req, res, next) => 
{
	const query = req.params.name;
	db.query("select * from products where title = $1",[query]).then(result => 
	{
		res.json(result);
	});
	
	//localhost:3000/prepared_statement/'; DELETE from products where id = 30 OR title = '    -- We cannot inject SQL anymore. The following statement will not work anymore    
});

//Stored Procedure
app.get('/create_procedure', (req, res, next) => 
{
	db.query(`
	CREATE OR REPLACE FUNCTION search_product (name TEXT)
	RETURNS SETOF products AS
	$BODY$
		SELECT * FROM products WHERE title = name;
	$BODY$
	LANGUAGE 'sql'
	`)
});

app.get('/stored_procedure/:name', (req, res, next) => 
{
	const name = req.params.name;
	db.query(`SELECT * FROM search_product($1)`, [name]).then((products) =>
	{
		res.json(products);
		res.end();
	});
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
});