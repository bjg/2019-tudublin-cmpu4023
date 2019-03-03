const express = require('express');
const http = require('http');
const massive = require('massive');

const bodyParser = require('body-parser');
let jwt = require('jsonwebtoken');
var crypto = require('crypto');

let config = require('./config');

function test(app) {
	app.get('/', (req,res) => res.send('Test anything displayed!'))
}

function part1_hashedpass(app) {
  app.get('/access', (req, res) => {

  		const name = req.query.username;
  		const pass = req.query.password;

  		console.log(name)
  		console.log(pass)
        // url = 
        // http://127.0.0.1:3000/access?username=ty&password=qwe

		const queryString = ""
		+ " SELECT * FROM products "
		+ " WHERE "
		+ " ${namevar} IN  "
		+ " ( SELECT username FROM users   "
		+ " WHERE "
		+ " username = ${namevar} "
		+ " AND hashpassword = crypt(${passvar},hashpassword) "
		+ " )  "
		+ " ; "
		+ "  ";

        req.app.get('db').query(queryString, {namevar: name,passvar:pass}).then(results => {
            res.json(results);
            console.log(results);
        });
    });
}

function part2_1_loginApi(app) {
  app.post('/login', (req, res) => {
  		const name = req.body.username;
  		const pass = req.body.password;
		
        // call = 
        // curl --data "username=ty&password=qwe" http://127.0.0.1:3000/login

		const queryString = ""
		+ " SELECT * FROM users   "
		+ " WHERE "
		+ " username = ${namevar} "
		+ " AND hashpassword = crypt(${passvar},hashpassword) "
		+ " ; "
		+ "  ";

        req.app.get('db').query(queryString, {namevar: name,passvar:pass}).then(results => {
    		if(results.length > 0) {
    			if(results.length > 1) { console.log('Multiple results, will return first');}

    			let user = results[0];

    			let token = jwt.sign(
					{userid: user.userid},
					config.secret,
					{ expiresIn: '24h' } 
				);

				return res.status(200).json({
					success: true,
					token: token
				});
    		} else {
    			return res.status(403).json({
    				success: false,
    				error:"Invalid username or password"}
				);
    		}		 
        });
    });
}

function checkToken(req, res, next) {
	let token = req.headers['authorization'];
	if (token && token.startsWith('Bearer ')) {
		token = token.slice(7, token.length);
	}

	if (token) {
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) {
				return res.status(403).json({
    				success: false,
    				error:"Invalid token"}
				);
			} else {
				req.decoded = decoded;
				next();
			}
		});
	} else {
		return res.status(403).json({
			success: false,
			error:"Invalid request, no token supplied"}
		);
	}
}

function part2_2_getResource(app) {
	app.get('/privateresource', checkToken, (req, res) => {
		// curl -X GET -H 'Authorization: Bearer tokenString' http://localhost:3000/privateresource

		// e.g. curl --data "username=ty&password=qwe" http://127.0.0.1:3000/login
		// returns
		// {"success":true,"message":"Authentication successful!","token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjUsImlhdCI6MTU1MTYzNTkyMywiZXhwIjoxNTUxNzIyMzIzfQ.IahRO3_yZsa0wiDXRgLvwCiIvIeEUlnA1Hm1JJeHFCI"}

		// So request is
		// curl -X GET -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjUsImlhdCI6MTU1MTYzNTkyMywiZXhwIjoxNTUxNzIyMzIzfQ.IahRO3_yZsa0wiDXRgLvwCiIvIeEUlnA1Hm1JJeHFCI' http://localhost:3000/privateresource

		const queryString = ""
		+ " SELECT * FROM products "
		+ " ; "
		+ "  ";

        req.app.get('db').query(queryString).then(results => {
            return res.status(200).json(results);
        });
	});
}

function part4_hmacAuthenticate(app) {
	app.post('/hmac', (req, res) => {
		var hashedkey = req.body.hashedkey;
		var accesskey = req.body.accesskey;
		var message  = req.body.message;

		const queryString = ""
		+ " SELECT secretkey FROM users   "
		+ " WHERE "
		+ " accesskey = ${accesskeyvar} "
		+ " ; "
		+ "  ";

    	req.app.get('db').query(queryString, {accesskeyvar: accesskey}).then(results => {
            if(results.length === 1) {
    			let user = results[0];

    			var computedHmac = crypto.createHmac('sha384', user.secretkey).update(message).digest('hex');

    			if(computedHmac === hashedkey) {

    				let protectedQueryString = "SELECT * FROM products;";
    				req.app.get('db').query(protectedQueryString).then(results => {
    					return res.status(200).json(results);
    				});

				} else {
					return res.status(403).json({error:"Invalid hashedkey"});
				}
    		} else {
    			return res.status(403).json({error:"Invalid accesskey"});
    		}
        });
	});
}

// SQL for parts 1 and 3
const createUserTableSql = ""
+ " DROP TABLE users; "
+ " CREATE TABLE users "
+ " ( "
+ " 	userid integer NOT NULL,"
+ " 	username character varying(255),"
+ " 	hashpassword character varying(255),"
+ " 	accesskey character varying(255),"
+ " 	secretkey character varying(255),"
+ "  	CONSTRAINT users_pkey PRIMARY KEY (userid)"
+ " ); "
+ "  ";

const userInsert = " INSERT INTO users (userid, username, hashpassword, accesskey, secretkey) VALUES "
+ "(5, 'ty', crypt('qwe',gen_salt('bf')), 'u8x!A%D*G-KaPdSgVkYp', 'y$B&E)H@McQfThWmZq4t5v8y/B?E(H+MbQeShVmY'); "

const createProductsTableSql = ""
+ " DROP TABLE products; "
+ " CREATE TABLE products "
+ " ( "
+ " 	productid integer NOT NULL,"
+ " 	name character varying(255),"
+ "  	CONSTRAINT products_pkey PRIMARY KEY (productid)"
+ " ); "
+ "  ";

const productsInserts = " INSERT INTO products (productid, name) VALUES (1, 'item 1'); "
+ " INSERT INTO products (productid, name) VALUES (2, 'book'); "
+ " INSERT INTO products (productid, name) VALUES (3, 'pen'); "

function rawQuery(app,queryString) {
	app.get('db').query(queryString).then(result => 
	{
		console.log(result);
	});	
}

// Starting point of the server
function main () {
	const app = express();
	app.use(bodyParser.urlencoded({ extended: false }));
	// app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	massive({
	host: '127.0.0.1',
	port: 5432,
	database: 'lab2',
	user: 'Emmet',
	password: 'petrolbear'
	}).then(instance => {
		app.set('db', instance);

		test(app);

		part1_hashedpass(app);

		part2_1_loginApi(app);
		part2_2_getResource(app);

		part4_hmacAuthenticate(app);

		http.createServer(app).listen(3000);
	});
}

main();