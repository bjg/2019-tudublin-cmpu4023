const express = require("express");
const Sequelize = require("sequelize");
const sequelize = new Sequelize("pgguide", "Red", "password", {
	host: "localhost",
	dialect: "postgres",
	define: {
		timestamps: false
	}
});
const model = require("./server/models/index")
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Sequelize app listening on port ${port}!`));

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.get("/users", (req, res) => {
	model.users.findAll({
		attributes: ["email", "details"],
		order: [["created_at", "desc"]]
	}).then(users => {
		res.json(users);
	});
});

app.get("/users/:id", (req, res) => {
	model.users.find({
		where: {id: req.params.id},
		attributes: ["email", "details"]
	}).then(user => {
		res.json(user);
	});
});

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

app.get("/products/:id", (req, res) => {
	model.products.find({
		where: {id: req.params.id},
	}).then(products => {
		res.json(products);
	});
});

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

// Create a new product.
app.post("/products", (req, res) => {
	model.products.create({
		title: req.body.title, price: req.body.price, tags: req.body.tags
	}).then(() => {
		res.sendStatus(200);
	});
});

// Update an existing product by id.
app.put("/products/:id", (req, res) => {
	model.products.update({
		title: req.body.title, price: req.body.price, tags: req.body.tags
	}, {
		where: {id: req.params.id}
	}).then(() => {
		res.sendStatus(200);
	});
});

// Delete a product by id.
app.delete("/products/:id", (req, res) => {
	model.products.destroy({
		where: {id: req.params.id}
	}).then(() => {
		res.sendStatus(200);
	});
});
