const express = require('express')
const massive = require('massive')
const app = express()
const port = 3000


massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'password'
}).then(instance => {
	app.set('db', instance);
	app.get('/users', (req, res) => {
		query = 'select email, details from users ORDER BY created_at DESC'

		req.app.get('db').query(query).then(users => {
			console.log(req.query.id)
			// console.log(users);
			res.json(users);
		});
	});

	app.get('/users/:id', (req, res) => {
		query = 'select email, details from users WHERE id=' + req.params.id;

		req.app.get('db').query(query).then(users => {
			res.json(users);
		});
	});


	app.get('/products', (req, res) => {
//CREATE OR REPLACE FUNCTION get_products(name VARCHAR(70)) RETURNS TABLE(id INTEGER, title VARCHAR(255), price NUMERIC) AS $$
//BEGIN
//    RETURN QUERY
//    SELECT products.id, products.title, products.price FROM products WHERE products.title LIKE name;
//END;
//$$ LANGUAGE plpgsql;
		query = 'select * from products ORDER BY price DESC'

		// http://142.93.45.124:3000/products?name=Dictionary
		// SQL INJECTION http://142.93.45.124:3000/products?name=';DELETE FROM PRODUCTS WHERE id=1 OR title LIKE '
		// New query = select * from products WHERE title LIKE '';DELETE FROM PRODUCTS WHERE id=1 OR title LIKE ''
		if (req.query.name) {
			query = "select * from products WHERE title LIKE '" + req.query.name + "'";
			query = "SELECT get_products('" + req.query.name + "');"
			// query = "SELECT * FROM products WHERE title LIKE '" + escape(req.query.name) + "'";  // Escape method
			// req.app.get('db').query("select * from products WHERE title LIKE $1", [req.query.name]).then(products => {res.json(products)});	// Parametarized method
                }
		
		console.log(query)
		req.app.get('db').query(query).then(products => {
			res.json(products);
		});
	});


	app.get('/products/:id', (req, res) => {
		query = 'select * from products WHERE id=' + req.params.id;

		req.app.get('db').query(query).then(products => {
			res.json(products);
		});
	});


	app.get('/purchases', (req, res) => {
		query = 'select purchase_items.price, purchase_items.quantity, purchase_items.state, purchases.name AS RECEIVER_NAME, purchases.address AS RECEIVER_ADDRESS, users.email AS PURCHASERS_EMAIL from purchase_items INNER JOIN PURCHASES ON (purchase_items.purchase_id=purchases.id) INNER JOIN USERS ON (purchases.user_id=users.id) ORDER BY price DESC'


		req.app.get('db').query(query).then(purchases => {
			res.json(purchases);
		});
	});


	app.listen(port, () => console.log("Example app listening on port ${port}!"));
});




