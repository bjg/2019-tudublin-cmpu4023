const express = require('express');
const massive = require('massive');
const app = express();
const port = 3000;

// Start massive
massive({
	host: '127.0.0.1',
	port: 5432,
	database: 'lab1',
	user: 'markbarrett',
	password: 'password',
}).then(db => {
	// Set the express db instance
	app.set('db', db);
});

// GET /users: 
app.get('/users', (req, res) => {
	app.get('db').users.find({}, {
		// Define column names and assign values
		exprs: {
		    email: 'email',
		    gender: "details::json->>'sex'",
		},
		// Order by created_at in ascending order
		order: [{field: 'created_at', direction: 'desc'}]
	}).then(users => {
		// Return the data
		res.send(users);
	})
})

// GET /users/:id
app.get('/users/:id', (req, res) => {
	// Find a single id that was passed in.
	app.get('db').users.findOne({
		id: req.params.id
	}, {
		exprs: {
			email: 'email',
		    gender: "details::json->>'sex'",
		}
	}).then(user => {
		res.send(user);
	});
})

// GET /products
/* 
	Extending the product as part 2 here.Allowing for the name to be passed in as an option.
	Using "product-unsafe" as an indicator of this route being unsafe. There is a safe one following this.
 */
app.get('/products-unsafe', (req, res) => {

	/*  Part 2:
		The following solution is an insecure implementation of the filtering of the product by name.
		It checks if the name of the product is given, if not it will just return all products, if so
		it will use an unsanitized un prepared query. By doing this, the following URL can be visited to
		delete the Dictionary product:

		http://localhost:3000/products/Dictionary'; DELETE FROM purchase_items WHERE product_id = 1; DELETE FROM products WHERE title = 'Dictionary

		Firstly the references to it need to be deleted in the purchase_items table then the product itself.

		These can be replaced with any values.
	*/
	// Check if the name is set
	if(req.query.name == undefined) {
		// If not then just return all of the products
		app.get('db').products.find({}, {}).then(products => {
			// Return the data
			res.send(products);
		})
	} else {
		// Basic, bad query
		app.get('db').query(
			"SELECT * FROM products WHERE title='"+req.query.name+"'"
		).then(purchases => {
			res.send(purchases);
		})
	}
})

// GET /products
/* 
	Extending the product as part 2 here.Allowing for the name to be passed in as an option.
	Using "product-safe" as an indicator of this route being safe. There is a unsafe one above.
 */
app.get('/products-safe', (req, res) => {
	/*
		Exercise 3:
		The following will check to see if the name value is given, if it is not then just return all products,
		if it is then use a prepared WHERE query to access the data.

		In contrast to the above, if this was run it would not work:
		http://localhost:3000/products/Python Book'; DELETE FROM purchase_items WHERE product_id = 2; DELETE FROM products WHERE title = 'Python Book;
	*/

	// Check if the name is set
	if(req.query.name == undefined) {
		// If not then just return all of the products
		app.get('db').products.find({}, {}).then(products => {
			// Return the data
			res.send(products);
		})
	} else {
		// Prepared query whic protects against injection.
		app.get('db').products.where(
			'title IN (SELECT title FROM products WHERE title = ${title})',
			{title: req.query.name}
		).then(products => {
			res.send(products);
		})
	}
})

// GET /products/:id
app.get('/products/:id', (req, res) => {
	// Find a single product by id
	app.get('db').products.findOne({
		id: req.params.id
	}).then(product => {
		res.send(product);
	})
})

// GET /purchases
app.get('/purchases', (req, res) => {
	// Find all purchases
	app.get('db').query(
		'SELECT name as receiver_name, address as receiver_address, email '+
		'as purchaser_email, purchase_items.state as delivery_status, purchase_items.price as price,'+ 
		'purchase_items.quantity as quantity FROM purchases JOIN users ON (purchases.user_id = users.id) '+
		'JOIN purchase_items ON (purchases.id = purchase_items.purchase_id) '+
		'ORDER BY purchase_items.price DESC'
	).then(purchases => {
		res.send(purchases);
	})
})

app.listen(port, () => console.log(`Express, listening on port ${port}!`));