const express = require("express");
const massive = require("massive");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const privKey  = fs.readFileSync('./id_rsa', 'utf8');
const pubKey  = fs.readFileSync('./id_rsa.pub', 'utf8');

const app = express();
const port = 3000;

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

app.get("/login", (req, res) => {
	const username = req.query.username;
	const password = req.query.password;
	await console.log(`Received /login request ${username} ${password}`);

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

app.get("/products", verifyToken, (req, res) => {
	console.log(`Received /products request`);
	res.sendStatus(200);
});
