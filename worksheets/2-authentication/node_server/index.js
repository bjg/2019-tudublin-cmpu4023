/*
	Name: Robert Vaughan
	StudentNo: C15341261

	A script that will expose endpoints that will
	allow a valid and active user to interact with 
	certain resources, which in this case will be a product
	table.

	There is two ways this interaction can be validated
		JWT
		HMAC

	JWT
		The user will log in and a secret key stored in the servers
		state will sign off on a token to be sent to the user. When
		the token is sent back on future reqesuts, a public key within
		the server will check the validity of the of said token. If it is valid,
		the users request continues to process.

	HMAC
		HMAC has two key components, a secrect and access key. The secret key
		must only be known by the client and the serer, never to be transmitted.
		To achieve this, we use a Diffie Hellman exchange. Once the secret and access
		is created, the server will persist these according to the user within the DB.

		When a request is made, the user will generate an Auth token and send it to a server with
		the aid of certain parameters (including the secret key). The server will use
		the same paramaters and generate the same token and if both match, the request
		is valid and continues.
*/

const express = require("express");
const massive = require("massive");
const jwt = require("jsonwebtoken");
const keypair = require("keypair");
const bodyParser = require("body-parser");
const assert = require("assert");
const crypto = require("crypto");

const app = express();
const port = 3000;

app.set("jwt_keypair", keypair(1024));

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	next();
});

app.use(bodyParser.json());

const db_password = "sqlisfun"

// Config to connect to DB
massive({
	host: "localhost",
	port: 5432,
	database: "auth_db",
	user: "postgres",
	password: db_password,
	ssl: false
}).then(instance => {
	app.set("db", instance);
});

const auth_string = "SELECT user_id, username FROM users WHERE username = ${username} AND password = crypt(${password}, password)";
const user_string = "SELECT user_id FROM users WHERE user_id = ${user_id}";
const key_insert_string = "UPDATE USERS SET secret_key = ${secret_key}, access_key = ${access_key} WHERE user_id = ${user_id}";
const select_key =  "SELECT secret_key FROM users WHERE access_key = ${access_key}";
const insert_key =  "INSERT INTO PRODUCTS (title, price) VALUES (${title}, ${price})";

/*
	A authenication process that check if the user is present in the DB.
	If so, a state based key pair will be used as part of a JWT transaction
	based authenication and a hash of the auth information will be created
	via a secret key, creating a token that is sent to the user.
*/
app.post("/user_auth_jwt", (req, res) => {
	req.app.get("db").query(
		auth_string,
		{username:req.body.username, password:req.body.password}
	).then(result => {
		if (result.length!=0) {
			const token = jwt.sign({
				iat: (Math.floor(Date.now() / 1000)),
				exp: (Math.floor(Date.now() / 1000) + (60 * 60 * 24)),
				id: result[0]["user_id"]
			}, 
			req.app.get("jwt_keypair").private, {
				algorithm:"RS256"
			});

			res.json({"token": token});
		}
		else {
			res.status(401).json({"error":"No such user"});
		}
	}).catch(error => {
		res.json(error);
	});
});

/*
	A GET Request that uses the public key stored within the servers
	state to check the authenication of a user. If the public key
	can parse the sent Auth header, the data within the header 
	shall be checked to see if it is a valid user (i.e. checking UID
	and timestamps).
*/
app.get("/products_jwt", (req, res) => {
	const auth = req.get("authorization");

	if (auth != null) {
		try {
			const token = jwt.verify(auth.split(" ")[1], req.app.get("jwt_keypair").public, {algorithm: "RS256"});
			req.app.get("db").query(
				user_string,
				{user_id:token["id"]}
			).then(result => {
				if ((token["exp"] > (Math.floor(Date.now() / 1000))) && result.length!=0) {
					req.app.get("db").products.find({},{
						exprs: {
							title: "title",
							price: "price"
						}
					}).then(result => {
						res.status(200).json(result);
					});
				}
				else {
					res.status(401).send("Invalid Authorization");
				}
			}).catch(error => {
				res.status(401).send("Authorization Required");
			});
		}
		catch(error) {
			res.status(401).send("Authorization Required");
		}
	}
	else {
		res.status(401).send("Authorization Required");
	}
});

/*
	A authenication process that check if the user is present in the DB.
	If so, a Diffie Hellman transaction will take place between the client
	and the server. Once the secret key is generated, the secrect and access key will be
	persisted while the access key is sent to the user. The access key will act as
	an identifier
*/
app.post("/secret_key", (req, res) => {
	req.app.get("db").query(
		auth_string,
		{username:req.body.username, password:req.body.password}
	).then(result => {
		if (result.length!=0) {
			const server = crypto.createDiffieHellman(req.body.prime, "base64");
			const serverKeyPair = server.generateKeys();

			const publicKey = server.getPublicKey("base64");
			const accessKey = (publicKey.substr(0, 20));

			const serverSecret = server.computeSecret(req.body.clientKey, "base64");

			const secretBase64 = serverSecret.toString("base64").substr(0, 40);

			app.set("secret_key", secretBase64);

			console.log("SECRET KEY");
			console.log(secretBase64);

			req.app.get("db").query(
				key_insert_string,
				{secret_key:secretBase64, access_key:accessKey, user_id:result[0]["user_id"]}
			).then(result => {
				res.json({
					"second_key": serverKeyPair.toString("base64"),
					"access_key": accessKey
				});
			});
		}
		else {
			res.status(401).json({"error":"No such user"});
		}
	}).catch(error => {
		res.json(error);
	});
});

/*
	A GET request that will fetch products based on if the
	users Auth Header token is the same as the token generated
	by the server with the aid of a Diffie Hellman secrey key, 
	a timestamp and request header.
*/
app.get("/products_hmac", (req, res) => {
	const auth = req.get("authorization");
	const type = req.get("content-type").toString("base64");

	const access_key = auth.split(" ")[1].split(":")[0];
	const hash = auth.split(" ")[1].split(":")[1];

	if (auth != null) {
		req.app.get("db").query(
			select_key,
			{access_key:access_key}
		).then(result => {
			if (result.length!=0) {
				const time = new Date();
				const timestamp = (time.getDate() + (time.getMonth()+1) + time.getFullYear());

				new_hash = crypto.createHmac("sha1", result[0]["secret_key"]).update(access_key + type + timestamp).digest("base64");

				if (hash == new_hash) {
					req.app.get("db").products.find({},{
						exprs: {
							title: "title",
							price: "price"
						}
					}).then(result => {
						res.status(200).json(result);
					});
				}
				else {
					res.status(401).json({"error":"No such user"});
				}
			}
			else {
				res.status(401).json({"error":"No such user"});
			}
		}).catch(error => {
			res.status(401).json({"error":"Authorization Required"});
		});
	}
	else {
		res.status(401).json({"error":"Authorization Required"});
	}
});

/*
	A POST request that will add a new product based on if the
	users Auth Header token is the same as the token generated
	by the server with the aid of a Diffie Hellman secrey key, 
	a timestamp and request header and the POST request body.
*/
app.post("/products_hmac_add", (req, res) => {
	const auth = req.get("authorization");
	const type = req.get("content-type").toString("base64");

	const access_key = auth.split(" ")[1].split(":")[0];
	const hash = auth.split(" ")[1].split(":")[1];

	const time = new Date();
	const timestamp = (time.getDate() + (time.getMonth()+1) + time.getFullYear());

	if (auth != null) {
		req.app.get("db").query(
			select_key,
			{access_key:access_key}
		).then(result => {
			if (result.length!=0) {
				new_hash = crypto.createHmac("sha1", result[0]["secret_key"]).update(access_key + type + timestamp + req.body).digest("base64");

				if (hash == new_hash) {
					req.app.get("db").query(
						insert_key,
						{title:req.body.title, price:req.body.price}
					).then(result => {
						res.status(200).json({"message":"Update made"});
					});
				}
				else {
					res.status(401).json({"error":"No such user"});
				}
			}
		}).catch(error => {
			res.status(401).json({"error":"Authorization Required"});
		});
	}
	else {
		res.status(401).json({"error":"Authorization Required"});
	}
});

app.listen(port, () => console.log("Listening on port %s!", port));