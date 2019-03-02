const express = require("express");
const Sequelize = require("sequelize");
const model = require("./server/models/index")
const bodyParser = require('body-parser');

const app = express();
const sequelize = new Sequelize("pgguide", "Red", "password", {
	host: "localhost",
	dialect: "postgres",
	define: {
		timestamps: false
	}
});
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.listen(port, () => console.log(`Sequelize app listening on port ${port}!`));

// Check for database connection.
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// GET /users
// List users' email and sex, most recently created first.
app.get("/users", (req, res) => {
	model.users.findAll({
		attributes: ["email", [sequelize.literal("COALESCE(details::json->>'sex', 'No sex')"), "sex"]],
		order: [["created_at", "desc"]]
	}).then(users => {
		res.json(users);
	});
});

// GET /users/:id
// Return a specific user's email and sex by id.
app.get("/users/:id", (req, res) => {
	model.users.find({
		where: {id: req.params.id},
		attributes: ["email", "details"]
	}).then(user => {
		res.json(user);
	});
});

// GET /products[?name=string]
// List all products, with optional searching by title using a query string.
// This implementation is protected from sql injection using a parameterised query.
app.get("/products", (req, res) => {
	name = req.query.name || "";
	model.products.findAll({
		where: {
			title: {
			  $like: "%" + name + "%"
			}
		},
		order: [["price", "asc"]]
	}).then(products => {
		res.json(products);
	});
});

// GET /products/:id
// Get a specific product by id.
app.get("/products/:id", (req, res) => {
	model.products.find({
		where: {id: req.params.id},
	}).then(products => {
		res.json(products);
	});
});

// GET /purchases
// Lists specific info for a purchase, ordered by price descending.
app.get("/purchases", (req, res) => {
	sequelize.query(
	`	select P.name, P.address, U.email, PI.price, PI.quantity, PI.state
		from purchase_items PI
		join purchases P on P.id = PI.purchase_id
		join users U on U.id = P.user_id
		order by PI.price desc`
	).then(purchases => {
		res.json(purchases);
	});
});

// POST /products
// Create a new product.
app.post("/products", (req, res) => {
	model.products.create({
		title: req.body.title, price: req.body.price, tags: req.body.tags
	}).then(() => {
		res.sendStatus(200);
	}).catch(err => {
		res.sendStatus(400);
	});
});

// PUT /products/:id
// Update an existing product by id.
app.put("/products/:id", (req, res) => {
	model.products.update({
		title: req.body.title, price: req.body.price, tags: req.body.tags
	}, {
		where: {id: req.params.id}
	}).then(() => {
		res.sendStatus(200);
	}).catch(err => {
		res.sendStatus(400);
	});
});

// DELETE /products/:id
// Delete a product by id.
app.delete("/products/:id", (req, res) => {
	model.products.destroy({
		where: {id: req.params.id}
	}).then(() => {
		res.sendStatus(200);
	}).catch(err => {
		res.sendStatus(400);
	});
});
