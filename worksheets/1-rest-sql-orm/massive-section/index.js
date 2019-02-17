/*
	Name: Robert Vaughan
	StudentNo: C15341261

	This file includes Parts 1, 2 and 3 of the lab brief

	The following script is a host of functions that
	expose endpoints to allow a client to make 
	GET Requests to fetch JSON formatted data.

	Any endpoint with that ends in "_dead" implies that
	it is a simple and somewhat unsafe way of fetching
	data, any other endpoint utilises Massive for
	CRUD operations (expect for /purchase since that includes
	joins)

	LIST OF ENDPOINT FUNCTIONS (Copy a below header and use an editors search function to find)
		GET /users
		GET /users/:id
		GET /products
		GET /products/:id
		GET /purchases
		GET /products_unsafe[?name=string]
		GET /products[?name=string]
		GET /products_function[?name=string]

	All endpoints have appropriate error responses with messages that can be potentially
	conveyed to the client

	***NOTICE***
			PART 5 is achieved with seeding
			Check the seeder directory for the test uploads
*/

const express = require("express");
const massive = require("massive");
const app = express();
const port = 3000;

// String that will create/replace the function in the DB
const procedure = "CREATE OR REPLACE FUNCTION productsbytitle(IN _title TEXT)\n"
+  "RETURNS SETOF products AS\n"
+ "$BODY$\n"
+ "BEGIN\n"
+  "return query\n"
+    "SELECT * FROM products\n"
+    "WHERE title=_title\n" 
+    "ORDER BY PRICE ASC;\n"
+ "END;\n"
+ "$BODY$\n"
+ "LANGUAGE plpgsql;";


// Query to show purchases
const puchase_query = "SELECT DISTINCT products.title, purchases.name, purchases.address, users.email"
+", purchase_items.price, purchase_items.quantity, purchase_items.state"
+" FROM purchases JOIN users ON (purchases.user_id = users.id)"
+" JOIN purchase_items ON (purchases.id = purchase_items.purchase_id)"
+" JOIN products ON (purchase_items.product_id = products.id)"
+" ORDER BY purchase_items.price DESC"

const db_password = "sqlisfun"

// Config to connect to DB
massive({
	host: "localhost",
	port: 5432,
	database: "pgguide",
	user: "postgres",
	password: db_password,
	ssl: false
}).then(instance => {
	app.set("db", instance);
});


/*
	GET /users

	Fetches and parses user data that should only be accessilbe to a client
*/
app.get("/users", (req, res) => {
	req.app.get("db").users.find({},{
		exprs: {
			email: "email",
			sex: "COALESCE(details::json->>'sex','No sex defined')"
		},
		order: [{
			field: "created_at", direction: "DESC"
		}]
	}).then(result => {
		res.json(result);
	});
});

/*
	GET /users/:id

	Fetches a specific user via their unique ID
*/
app.get("/users/:id", (req, res) => {
	req.app.get("db").users.findOne({
		id: req.params.id
	}, {
		exprs: {
			email: "email",
			sex: "COALESCE(details::json->>'sex','No sex defined')"
		},
		order: [{
			field: "created_at", direction: "DESC"
		}]
	}).then(result => {
		if (result == null || result.length===0) {
			res.json({"message": ("No data with id " + req.params.id)});
		}
		else {
			res.json(result);
		}
	}).catch(error => {
		res.json({"error": ("Unexpected error occurred")});
	});
});

/*
	GET /products
	GET /products_unsafe[?name=string]
	GET /products_function[?name=string]

	With the one endpoint, we can host both requirements of "GET /products" and
	"GET /products[?name=string]" by using conditional logic to check for the presence
	of a name parameter in the URL

	Fetches back all of the data in products

	With regards to GET /products[?name=string], to test the lack of security of such a query, use
	GET /products_unsafe[?name=string] with the below sample string

	localhost:3000/products_unsafe?name=Dictionary'; DELETE FROM purchase_items WHERE product_id = 1; DELETE FROM products WHERE id = 1; COMMIT; SELECT * FROM products WHERE '1'='1

	localhost:3000/products?name=Python Book'; DELETE FROM purchase_items WHERE product_id = 2; DELETE FROM products WHERE id = 2; COMMIT; SELECT * FROM products WHERE '1'='1

	localhost:3000/product_function?name=Python Book'; DELETE FROM purchase_items WHERE product_id = 2; DELETE FROM products WHERE id = 2; COMMIT; SELECT * FROM products WHERE '1'='1
*/

// GET /products_unsafe[?name=string]
// Allows for injections
app.get("/products_unsafe", (req, res) => {
	if (req.query.name == null) {
		req.app.get("db").query(
			"SELECT * FROM products ORDER BY PRICE ASC"
		).then(result => {
			res.json(result);
		}).catch(error => {
			res.json({"error": ("Unexpected error occurred")});
		});
	}
	else {
		req.app.get("db").query(
			"SELECT * FROM products WHERE title='" + req.query.name + "' ORDER BY PRICE ASC"
		).then(result => {
			if (result == null || result.length===0) {
				res.json({"message": ("No products with title " + req.query.name)});
			}
			else {
				res.json(result);
			}
		}).catch(error => {
			res.json({"error": ("Unexpected error occurred")});
		});
	}	
});

// GET /products[?name=string]
// Uses a paramaterised query
app.get("/products", (req, res) => {
	if (req.query.name == null) {
		req.app.get("db").products.find({}, {
			exprs: {
				title: "title",
				price: "price",
				tags: "tags"
			},
			order: [{field: "price", direction: "asc"}]
		}).then(result => {
			res.json(result);
		}).catch(error => {
			res.json({"error": ("Unexpected error occurred")});
		});
	}
	else {
		// String insertion that will prevent an injection
		req.app.get("db").products.where(
			"title IN (SELECT title FROM products WHERE title = ${title} ORDER BY PRICE ASC)",
			{title: req.query.name}
		).then(result => {
			if (result == null || result.length===0) {
				res.json({"message": ("No data with title " + req.query.name)});
			}
			else {
				res.json(result);
			}
		}).catch(error => {
			if (error == null || error.length || Object.keys(error).length === 0) {
				res.json({"message": ("No data with title " + req.query.name)});
			}
			else {
				res.json(error);
			}
		});
	}
});

// GET /products_function[?name=string]
// Writes/Replaces a DB function that 
app.get("/products_function", (req, res) => {
	if (req.query.name != null) {
		req.app.get("db").query(
			procedure
		).then(items => {
			req.app.get("db").productsbytitle(req.query.name).then(result => {
				if (result == null || result.length===0) {
					res.json({"message": ("No title " + req.query.name)});
				}
				else {
					res.json(result);
				}
			}).catch(error => {
				res.json({"error": "Unexpected error occurred"});
			});
		}).catch(error => {
			res.json({"error": "Unexpected error occurred"});
		});
	}
});

/*
	GET /products/:id

	Retreives products data via a specific ID
*/
app.get("/products/:id", (req, res) => {
	req.app.get("db").products.findOne({
		id: req.params.id
	}, {
		exprs: {
			title: "title",
			price: "price",
			tags: "tags"
		}
	}).then(result => {
		if (result == null || result.length===0) {
			res.json({"message": ("No data with ID " + req.params.id)});
		}
		else {
			res.json(result);
		}
	}).catch(error => {
		res.json({"error": ("Unexpected error occurred")});
	});
});

/*
	GET /purchases

	Retreives all products. This could only be done with a raw query
	for Massive does not support joins
		https://github.com/dmfay/massive-js/issues/263
*/
app.get("/purchases", (req, res) => {
	const id = req.params.id;
	req.app.get("db").query(
		puchase_query
	).then(result => {
		res.json(result);
	}).catch(error => {
		res.json(error)
	});
});

app.listen(port, () => console.log("Listening on port %s!", port));