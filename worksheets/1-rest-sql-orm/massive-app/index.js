const express = require('express')
const app = express()
const port = 3000

const massive = require('massive');

massive({
	host: 'localhost',
	port: 5432,
	database: 'pgguide',
	user: 'ycc',
	password: 'toor1234',
	ssl: false,
	poolSize: 10
}).then(db => {
	app.set('db', db)
	app.get('/', (req, res) => res.send('RESTful API - Express & Massive<br>\
		/users - List all users email and sex in order of most recently created. Do not include password hash in your output<br>\
		/users/:id - Show above details of the specified user<br>\
		/products - List all products in ascending order of price<br>\
		/products/:id - Show details of the specified products<br>\
		/purchases - List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, quantity and delivery status of the purchased item. Order by price in descending order<br>\
		/products[?name=string] - Show details of product with "string" as the name<br>\
		'
	));

	// GET /users
	// List all users email and sex in order of most recently created. Do not include password hash in your output
	app.get('/users', (req, res) => {
		db.query('SELECT email, gender FROM users ORDER BY id').then(users => {
			res.send(users);
		})
	});

	// GET /users/:id
	// Show above details of the specified user
	app.get('/users/:id', (req, res) => {
		db.users.findOne(req.params.id).then(user => {
			if (!user) {
				res.status(404).send(`No user with id: ${req.params.id}`);
			}

			res.send(user);
		});
	});

	// GET /products
	// List all products in ascending order of price
	app.get('/products', (req, res) => {
		if(Object.keys(req.query).length === 0 && req.query.constructor === Object) {
			console.log(req.query);
			console.log("empty");
			db.query('SELECT id, title, price FROM products ORDER BY price').then(products => {
				res.send(products);
			});
		}
		else {
			// let productName = req.query.name;
			// console.log(productName);
			// let query = 'SELECT id, title, price FROM products where LOWER(title)=' + Object.toString(productName) + ' ORDER BY price'
			// db.query(query).then(products => {
			// 	if (Object.keys(products).length === 0) {
			// 		res.status(404).send(`No product with name: ${req.query.name}`);
			// 	}
			// 	res.send(products);
			// });
			console.log(typeof req.query.name);
			console.log(req.query.name);
			db.query('SELECT id, title, price FROM products where LOWER(title)=LOWER(${name})ORDER BY price', req.query).then(products => {
				if (Object.keys(products).length === 0) {
					res.status(404).send(`No product with name: ${req.query.name}`);
				}
				else {
					res.send(products);
				}
			});
		}
	});

	// GET /products/:id
	// Show details of the specified products
	app.get('/products/:id', (req, res) => {
		db.products.findOne(req.params.id).then(product => {
			if (!product) {
				res.status(404).send(`No product with id: ${req.params.id}`);
			}

			res.send(product);
		});
	});

	// GET /purchases
	// List purchase items to include the receiver’s name and, address, the purchaser’s
	// email address and the price, quantity and delivery status of the purchased item.
	// Order by price in descending order
	app.get('/purchases', (req, res) => {
		db.query('SELECT u.name, pu.address, u.email, pi.price, pi.quantity, pi.state \
			FROM purchases pu \
			JOIN users u on pu.user_id=u.id \
			JOIN purchase_items pi on pu.id=pi.purchase_id \
			ORDER BY pi.price DESC').then(purchases => {
			res.send(purchases);
		});
	});

	app.listen(port, () => console.log(`REST API app listening on port ${port}!`));
});

