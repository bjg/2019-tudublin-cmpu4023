const express = require('express')
const massive = require('massive')
const app = express()
const port = 3000

massive({
	host: 'localhost',
	port: 5432,
	database: 'pgguide',
	user: 'postgres',
	password: 'pass',
	ssl: false,
	poolSize: 10
}).then(instance => {
	app.set('db', instance)

	// *** 1 GET /users ***
	// http://localhost:3000/users
	app.get('/users', async (req, res) => {
		const db = req.app.get('db')
		var users = await db.query('select email, details from users order by created_at desc')
		for(var i = 0; i < users.length; i++) {
			var user = users[i]
			if(user.details != null) {
				if(user.details.includes("sex")) {
					var sex = user.details.slice(0, 10)
					user.details = sex
				}
			}
		}
		res.send(users);
	})

	// *** 1 GET /users ***
	// http://localhost:3000/users/1
	app.get('/users/:id', async (req, res) => {
		var id = req.params.id
		const db = req.app.get('db')
		const textQuery = 'select email, details from users where id = $1'
		var user = await db.query(textQuery, id)
		if(user.details != null) {
		if(user.details.includes("sex")) {
			var sex = user.details.slice(0, 10)
			user.details = sex
		}}

		res.send(user)
	})

	// *** 1 & 3 parameterised query***
	// http://localhost:3000/products
	// http://localhost:3000/products?name=Dictionary
	// 
	// app.get('/products', async (req, res) => {
	// 	var name = req.query.name
	// 	const db = req.app.get('db')
	// 	var products;
	// 	if(!name) {
	// 		products = await db.query('select * from products order by price')
	// 		res.send(products)
	// 	} else {
	// 		const textQuery = 'select * from products where title = $1'
	// 		products = await db.query(textQuery, name)
	// 		res.send(products)
	// 	}
	// })

	// *** 3 stored procedure sql ***
	// create or replace function prod_search(name varchar)
	// returns products as $$
	// 	select * from products where title = name
	// $$
	// language sql;

	// *** 1 & 3 calling stored procedure ***
	// http://localhost:3000/products?name=Dictionary
	app.get('/products', async (req, res) => {
		var name = req.query.name
		const db = req.app.get('db')
		var products;
		if(!name) {
			products = await db.query('select * from products order by price')
			res.send(products)
		} else {
			const textQuery = 'select * from prod_search($1);'
			products = await db.query(textQuery, name)
			res.send(products)
		}
	})

	// *** 1 GET /products/:id ***
	// http://localhost:3000/products/1
	app.get('/products/:id', async (req, res) => {
		var id = req.params.id;
		const db = req.app.get('db')
		var product = await db.query('select * from products where id = ' + id)
		res.send(product)
	})

	// *** 1 GET /purchases ***
	// http://localhost:3000/purchases
	app.get('/purchases', async (req, res) => {
		const db = req.app.get('db')
		var purchases = await db.query('select name, address, email, price, quantity, pitems.state ' +
			'from purchase_items pitems ' +
			'inner join purchases purch on pitems.purchase_id = purch.id ' +
			'inner join users u on purch.user_id = u.id order by price desc;')
		res.send(purchases)
	})

	// *** 2 GET /products[?name=string] (bad implementation) ***
	// http://localhost:3000/products
	// http://localhost:3000/products?name=Dictionary';delete from products where id=20; --
	// app.get('/products', async (req, res) => {
	// 	var name = req.query.name
	// 	const db = req.app.get('db')
	// 	var products;
	// 	if(!name) {
	// 		products = await db.query('select * from products order by price')
	// 		res.send(products);
	// 	} else {
	// 		var myQuery = `select * from products where title = '${name}'`
	// 		products = await db.query(myQuery)
	// 		res.send(products);
	// 	}
	// })

	app.listen(port, () => console.log(`Example app listening on port ${port}!`))
})