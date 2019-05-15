const express = require('express')
const app = express()
const port = 3000

var massive = require("massive");

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

massive({
    host: 'localhost',
    port: 5432,
    database: 'pgguide',
    user: 'postgres',
    password: 'Flamingmarshmallow97',
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
        db.query('SELECT email, details FROM users ORDER BY created_at').then(users => {
            res.send(users);
        })
    });
	
	// GET /users/:id
    // Show above details of the specified user
    app.get('/users/:id', (req, res) => {
		var id = req.params.id;
        db.query('SELECT * FROM users WHERE id = '+id+'').then(users => {
            res.send(users);
        })
    });
	
	// GET /products
    // List all products in ascending order of price
    app.get('/products', (req, res) => {
        db.query('SELECT * FROM products ORDER BY price ASC').then(products => {
            res.send(products);
        })
    });
	
	// GET /products/:id
    // Show above details of the specified user
    app.get('/products/:id', (req, res) => {
		var id = req.params.id;
        db.query('SELECT * FROM products WHERE id = '+id+'').then(products => {
            res.send(products);
        })
    });
	
	// GET /purchases
    // List purchase items to include the receiver’s name and, address, the purchaser’s email address and the price, 
	//quantity and delivery status of the purchased item. Order by price in descending order
    app.get('/purchases', (req, res) => {
        db.query('SELECT purchases.name, purchases.address, users.email, purchase_items.price, ' +
				'purchase_items.quantity, purchase_items.state ' + 
				'FROM purchase_items ' +
				'INNER JOIN purchases ON purchase_items.purchase_id = purchases.id ' +
				'INNER JOIN users ON purchases.user_id = users.id ' +
				'ORDER BY purchase_items.price DESC;').then(products => {
            res.send(products);
        })
    });
	
	// Example of product retrieval that is vulnerable to sql injection
	app.get('/sql_inject/products', function (req, res, next) {
	  var title_name = req.query.name;
	  var query = 'SELECT * FROM products WHERE title = \'' + title_name + '\' ';
	  console.log(query)
	  try {
		req.app.get('db').query('SELECT * FROM products WHERE title = \'' + title_name + '\'')
		  .then(tests => {
			res.send(tests)
		  })
	  } catch (err) {
		res.json(err);
	  }
	});

	// Solution with parameterised query
	app.get('/parameterisedQuery', (req, res) => {
	  var title_name = req.query.title;
	  req.app.get('db').query("SELECT * FROM products WHERE title = ${title}",{
		title: title_name
	  }).then(tests => {
		res.send(tests);
	  });
	});


	// Solution with stored procedure
	app.get('/storedProcedure', (req, res) => {
	  var title_name = req.query.title;
	  req.app.get('db').query("SELECT * FROM getProductByTitle(\'" + title_name + "\');"
	  ).then(tests => {
		res.send(tests);
	  });
	});
});