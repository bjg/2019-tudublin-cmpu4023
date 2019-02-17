/*
	Name: Robert Vaughan
	StudentNo: C15341261

	This file includes parts 4 and 6 of the lab brief

	The following script is a host of functions that
	expose endpoints to allow a client to make 
	various forms of requests to retreive and alter
	persisted data.

	LIST OF ENDPOINT FUNCTIONS (Copy a below header and use an editors search function to find)
		PART 1
			GET /users
			GET /users/:id
			GET /products
			GET /products/:id
			GET /purchases
			GET /products[?name=string]

		PART 6
			GET /products[?name=string]
			GET /products/:id
			POST /products
			PUT /products/:id
			DELETE /products/:id

	All endpoints have appropriate error responses with messages that can be potentially
	conveyed to the client

	Migration (Windows path)
		.\node_modules\.bin\sequelize db:migrate

	SEED (Windows path)
		.\node_modules\.bin\sequelize db:seed:all

	***NOTICE***
			PART 5 is achieved with seeding
			Check the seeder directory for the test uploads
*/

// Get count of the sequence

const express = require("express");
const Sequelize = require("sequelize");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

const models = require("./models/index");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set("db", models);

/*
	----- Sequelize implementation for Part 1 + 2
*/

/*
	GET /users

	Fetches and parses user data that should only be accessilbe to a client
*/
app.get("/users", (req, res) => {
	req.app.get("db").users.findAll({
		attributes: ["email", "details"],
		order: [
			["createdAt", "DESC"]
		],
		raw: true
	},{
	}).then(json => {
		let jsonArray = [];
		for (let i = 0; i < json.length; i++) {
			if (json[i].details != null) {
				if (json[i].details.sex != null) {
					jsonArray.push({"email": json[i].email, "sex": json[i].details.sex})
				}
				else {
					res.json({"email": json.email, "sex": "No sex defined"})
				}
			}
			else {
				jsonArray.push({"email": json[i].email, "sex": "No sex defined"})
			}
		}
		res.json(jsonArray);
	}).catch(error => {
		res.json(error);
	});
});

/*
	GET /users/:id

	Fetches a specific user via their unique ID
*/
app.get("/users/:id", (req, res) => {
	req.app.get("db").users.findOne({
		attributes: ["email", "details"],
		where: {
			id: req.params.id
		}
	}).then(json => {
		if (json != null) {
			if (json.details != null) {
				if (json.details.sex != null) {
					res.json({"email": json.email, "sex": json.details.sex})
				}
				else {
					res.json({"email": json.email, "sex": "No sex defined"})
				}
			}
			else {
				res.json({"email": json.email, "sex": "No sex defined"})
			}
		}
		else {
			res.json({"message": "No data with ID " + req.params.id})
		}
	}).catch(error => {
		res.json({"error": "Unexpected error occurred"});
	});
});

/*
	GET /products
	GET /products[?name=string]

	With the one endpoint, we can host both requirements of "GET /products" and
	"GET /products[?name=string]" by using conditional logic to check for the presence
	of a name parameter in the URL

	Fetches and parses user dats that should only be accessilbe to a client

	With regards to GET /products[?name=string], to test the lack of security of such a query, use
	GET /products_dead[?name=string] with the below sample string
*/
app.get("/products", (req, res) => {
	if (req.query.name == null) {
		req.app.get("db").products.findAll({
			attributes: ["title", "price", "tags"],
			order: [
				["price", "ASC"]
			]
		},{
		}).then(items => {
			res.json(items);
		}).catch(error => {
			res.json(error);
		});
	}
	else {
		req.app.get("db").products.findAll({
			attributes: ["title", "price", "tags"],
			where: {
				title: req.query.name
			},
			order: [
				["price", "ASC"]
			]
		},{
		}).then(result => {
			if (result == null) {
				res.json({"message": "No data with ID " + req.params.id});
			}
			else {
				res.json(result);
			}
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
		attributes: ["title", "price", "tags"],
		where: {
			id: req.params.id
		}
	}).then(result => {
		if (result == null) {
			res.json({"message": "No data with ID " + req.params.id});
		}
		else {
			res.json(result);
		}
	}).catch(error => {
		res.json({"error": "Unexpected error occurred"});
	});
});

/*
	GET /purchases

	Retreives all products. This is a complex query that
	required some hacks to get around known bug issues within
	Sequelize.js

	Aliasing within the include operator is not fully supported
		https://github.com/sequelize/sequelize/issues/1556
*/
app.get("/purchases", (req, res) => {
	req.app.get("db").purchases.findAll({
		attributes: [[Sequelize.literal('DISTINCT "name"'), "name"], ["address", "address"]],
		include: [
			{
				model: app.get("db").users,
				attributes: ["email"]
			},
			{
				model: app.get("db").purchase_items,
				attributes: ["price", "quantity", "state"],
				include: [{
					model: app.get("db").products,
					attributes: ["title"]
				}],
				where: {
					"price": { $ne: null }
				},
			},
		],
		order: [
			[app.get("db").purchase_items, "price", "DESC"]
		],
		raw: true
	}).then(items => {
		res.json(items);
	}).catch(error => {
		res.json(error);
	});
});

/*
	POST /products

	Creates a new Product intance within the database
	Before the processing of data, a check occurs to 
	ensure that the given ID is valid. Sequelize sadly
	does not support DB sequences
*/
app.post("/products", (req, res) => {
	if (req.body.id != null && req.body.title != null 
		&& req.body.price != null && req.body.tags){
		req.app.get("db").products.findOne({
			where: {
				id: req.body.id
			}
		}).then(products => {
			if (products == null) {
				req.app.get("db").products.create({ 
					id: req.body.id,
					title: req.body.title,
					price: req.body.price,
					tags: JSON.parse(req.body.tags)["tags"],
					createdAt: new Date()
				}).then(product => {
					 res.json(product)
				});
			}
			else {
				res.json({"message": "ID in use"})
			}
		});
	}
	else {
		res.json({"error": "Missing update values"});
	}
});


/*
	PUT /products/:id

	Updates an existing instance of product.
	3 parameters are required
		title
		price
		tags
*/
app.put("/products/:id", (req, res) => {
	if (req.params.id != null && req.body.title != null 
		&& req.body.price != null && req.body.tags){
		req.app.get("db").products.update({ 
			title: req.body.title,
			price: req.body.price,
			tags: JSON.parse(req.body.tags)["tags"]
		},{
			where: {id: req.params.id}
		}).then(productCount => {
			if (productCount > 0) {
				res.json({"message": "Update occurred"});
			}
			else {
				res.json({"message": "No update"});
			}
		});
	}
	else {
		res.json({"error": "Missing update values"});
	}
});

/*
	DELETE /products/:id

	Creates a new Product intance within the database
	Before the processing of data, a check occurs to 
	ensure that the given ID is valid. Sequelize sadly
	does not support DB sequences
*/
app.delete("/products/:id", (req, res) => {
	req.app.get("db").purchase_items.destroy({
		where: {
			productId: req.params.id
		}
	}).then(result => {
		req.app.get("db").products.destroy({
			where: {
				id: req.params.id
			}
		}).then(resultCount => {
			if (resultCount > 0) {
				res.json({"message": "Delete successful"});
			}
			else {
				res.json({"message": "No delete occurred"});
			}
		});
	});
});

app.listen(port, () => console.log("Listening on port %s!", port));