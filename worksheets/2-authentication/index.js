const express = require("express");
const massive = require("massive");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const crypto = require("crypto");
const bodyParser = require('body-parser');

const privKey  = fs.readFileSync('./id_rsa', 'utf8');
const pubKey  = fs.readFileSync('./id_rsa.pub', 'utf8');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.listen(port, () => console.log(`App listening on port ${port}!`));

massive ({
	host: "127.0.0.1",
	port: 5432,
	database: "lab2",
	user: "Red",
	password: "password",
}).then(instance => {
	app.set("db", instance)
});

/*******
 * JWT *
 *******/

// Middleware to verify a JWT.
function verifyToken(req, res, next) {
	const token = req.headers.authorization;
	console.log("Verifying token: " + token);

	var verifyOptions = {
		expiresIn:  "12h",
		algorithm:  ["RS256"]
	};

	try {
		// This throws an exception if the token is malformed or invalid.
		const verify = jwt.verify(token, pubKey, verifyOptions);
		console.log("Verification result: " + JSON.stringify(verify));
		next();
	} catch {
		console.log("Verification failed");
		res.status(401);
		next("You must be logged in to access this resource");
	}
}

// Endpoint to allow a user to login.
// Returns a JWT on successful login.
app.post("/login", (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	console.log(`Received /login request ${username} ${password}`);

	if (!username || !password) {
		res.status(400).send("Must provide username and password");
		return;
	}

	req.app.get("db").query(
	`	select * from users
		where username = '${username}'
		and hashed_password is not null
		and hashed_password = crypt('${password}', hashed_password)`
	).then(user => {
		if (user.length != 1) {
			res.status(401).send("Invalid username or password");
			return;
		}
		const signOptions = {
			expiresIn: "12h",
			algorithm: "RS256"
		}
		const payload = {
			username: username
		}
		const token = jwt.sign(payload, privKey, signOptions);
		console.log(`Generated signed token for ${username}: ${token}`);
		res.send(token);
	});
});

app.post("/products-jwt", verifyToken, (req, res) => {
	console.log(`Received /products request`);
	const name = req.body.name;
	const price = req.body.price;

	req.app.get("db").query(
		`insert into products(name, price) values('${name}', ${price})`
	).then(() => {
		console.log("New product inserted: " + name + " " + price);
		res.sendStatus(200);
	}).catch(err => {
		console.log(err);
		res.sendStatus(400);
	});
});

/********
 * HMAC *
 ********/

// Middleware to verify a HMAC hash.
function verifyHmac(req, res, next) {
	const accessKey = req.headers.authorization;
	const clientHmac = req.headers.hmac;
	const timestamp = req.headers.timestamp;
	const message = req.body.message;
	console.log("Verifying client hmac: " + clientHmac);

	req.app.get("db").query(
		`select secret_key from users where access_key='${accessKey}'`
	).then(users => {
		const secretKey = users[0].secret_key.toString();
		// HMAC is performed on a combination of the access key, message and timestamp.
		const combined = accessKey + message + timestamp;
		console.log(combined);
		const serverHmac = crypto.createHmac("sha256", secretKey).update(combined).digest("hex");
		console.log("Generated server-side hmac: " + serverHmac);
		if (serverHmac == clientHmac) {
			return next();
		}
		console.log("Failed to verify user");
		res.status(401);
		next("HMAC hash did not match");
	});
}

// Add a new product.
// Protected by HMAC.
app.post("/products-hmac", verifyHmac, (req, res) => {
	console.log(`Received /products-hmac request`);
	const message = req.body.message;

	product = JSON.parse(message);

	req.app.get("db").query(
		`insert into products(name, price) values('${product.name}', ${product.price})`
	).then(() => {
		console.log("New product inserted: " + product.name + " " + product.price);
		res.sendStatus(200);
	}).catch(err => {
		console.log(err);
		res.sendStatus(400);
	});
});
