const express = require("express");
const massive = require("massive");
const app = express();
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Massive app listening on port ${port}!`));

massive ({
	host: "127.0.0.1",
	port: 5432,
	database: "pgguide",
	user: "Red",
	password: "password",
}).then(instance => {
	app.set("db", instance)
});

app.get("/users", (req, res) => {
	req.app.get("db").users.find({}, {
		fields: ["email"],
		exprs: {
			sex: "COALESCE(details::json->>'sex', 'No sex')"
		},
		order: [{
			field: "created_at",
			direction: "desc"
		}]
	}).then(users => {
		res.json(users);
	});
});

app.get("/users/:id", (req, res) => {
	req.app.get("db").users.findOne({
		id: req.params.id
	}, {
		fields: ["email"],
		exprs: {
			sex: "COALESCE(details::json->>'sex', 'No sex')"
		}
	}).then(user => {
		res.json(user);
	});
});

// URL that deletes the row with id 3 in purchase_items:
// http://localhost:3000/products-inject?name=Book%27;delete%20from%20purchase_items%20where%20id=3;--
app.get("/products-inject", (req, res) => {
	var query = "select * from products where title like '%" + String(req.query.name) + "%'";
	req.app.get("db").query(
		query
	).then(products => {
		res.json(products);
	});
});

// Protected from injection using parameterised query.
// The above URL will not result in a row being deleted from the database.
app.get("/products", (req, res) => {
	name = req.query.name || "";
	req.app.get("db").products.find({
		or: [{
			"title like": "%" + name + "%"
		}]
	}, {
		order: [{
			field: "price",
			direction: "asc"
		}]
	}).then(products => {
		res.json(products);
	});
});

// Protected from injection using a PLPGSQL function.
// The above URL will not result in a row being deleted from the database.
app.get("/products-function", (req, res) => {
	console.log(req.query.name);
	req.app.get("db").query(
		"select find_product('" + String(req.query.name) + "')"
	).then(products => {
		console.log(products);
		res.json(products);
	}).catch(err => res.send("Error"));
});

app.get("/products/:id", (req, res) => {
	req.app.get("db").products.findOne({
		id: req.params.id
	}).then(product => {
		res.json(product);
	});
});

app.get("/purchases", (req, res) => {
	req.app.get("db").query(
	`	select P.name, P.address, U.email, PI.price, PI.quantity, PI.state
		from purchase_items PI
		join purchases P on P.id = PI.purchase_id
		join users U on U.id = P.user_id
		order by PI.price desc`
	).then(purchases => {
		res.json(purchases);
	});
});

// app.get("/purchases", (req, res) => {
	// req.app.get("db").query(
	// `	select name, address, email, price, quantity, state
		// from purchase_items
		// join purchases on purchases.id = purchase_items.purchase_id);`
	// ).then(purchases => {
		// res.json(purchases);
	// });
// });

// app.get("db").listTables();
// db = app.get("db");
// db.listTables();
// req.app.get("db").users
