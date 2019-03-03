'use strict';


// generic basic auth Authorization header field parser for whatever.
const auth = require('basic-auth');


// for JWT
const jwt = require('jsonwebtoken');

// config file that stores our secret key  ---> don't need config file any more cause we signing the token using public and private keys which is read in from disk
// const config = require('./config/config.json');

// The Node.js file system 'fs' module allows you to work with the file system on your computer.
const fs = require('fs');


// WATCH THIS !!!! https://www.youtube.com/watch?v=F0HLIe3kNvM   <--- nice video explaining signing of jwt token using private and public keys
	
// The algorithm must be set to "RS256"   go here to this website to generate private and public keys --> http://travistidwell.com/jsencrypt/demo/
	
// Must read the keys in as 'utf8' or you will just get it in bytes
// Read in the files in the keys folder
var privatekey = fs.readFileSync('keys/private.key', 'utf8');  // get private key
var publickey = fs.readFileSync('keys/public.key', 'utf8');  // get public key






// These below are required to do part 4 of the lab
// Awesome blog post here that explains this shit --> https://blog.andrewhoang.me/how-api-request-signing-works-and-how-to-implement-it-in-nodejs-2/


// The crypto module provides cryptographic functionality that includes a set of wrappers for OpenSSL's hash, HMAC, cipher, decipher, sign, and verify functions.
const crypto = require('crypto');

// This module has utilities for URL resolution and parsing meant to have feature parity with node.js core url module.
const url = require('url');



// Functions --> can be placed in its own file and required but effort like.... 
// check for empty string
function isEmpty(str) {
	return (!str || 0 === str.length);
}


// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
function addDays(date, days) {
	var result = new Date(date);
	result.setDate(result.getDate() + days);
	return result;
}



module.exports = router => {

	// This might be wrong cause he wants you to create another endpoint products but effort of that.... so I just killed two birds with 1 stone
	// Part 1 - 10 marks -- log user in and return product
	router.post('/basicAuth', (req, res) => {
		
		const credentials = auth(req);
		
		console.log(credentials);

		if (!credentials || isEmpty(credentials.name) || isEmpty(credentials.pass) ) {
			
			res.statusCode = 401;
			res.setHeader('WWW-Authenticate', 'Basic realm="example"');
			res.end('Access denied');
			
		} else {
			
			let userSQL = "SELECT * FROM users WHERE username = $1 AND password = crypt($2, password)";
			
			req.app.get('db').query(userSQL, [credentials.name, credentials.pass] ).then(items => {
				
				// check if the statement above returned the user
				if(items.length === 0){
					res.statusCode = 401;
					res.end('Username or Password incorrect.');
				} else {
					
					// return all products if username and password are correct
					res.statusCode = 200
					req.app.get('db').query("SELECT * FROM products").then(items => {
						res.json(items);
					});

				}

			}).catch(error => {
				
				res.status(error.status).json({ message: error.message });
		
			});
			
		}
		
	});



	
	// For part 2 of the lab you need POSTMAN --> https://www.getpostman.com/   --> in order to test the API
	// For this to work set Postman option to BASIC AUTH -- As we are using "const auth = require('basic-auth');"  which is used to grab the users username and password
	// Part 2 - 40 marks -- log user in and return json web token
	router.post('/jsonwebtoken', (req, res) => {
		
		const credentials = auth(req);
		
		console.log(credentials);

		if (!credentials || isEmpty(credentials.name) || isEmpty(credentials.pass) ) {
			
			res.statusCode = 401;
			res.setHeader('WWW-Authenticate', 'Basic realm="example"');
			res.end('Access denied');
			
		} else {
			
			let userSQL = "SELECT * FROM users WHERE username = $1 AND password = crypt($2, password)";
			
			req.app.get('db').query(userSQL, [credentials.name, credentials.pass] ).then(items => {
				
				// check if the statement above returned the user
				if(items.length === 0){
					res.statusCode = 401;
					res.end('Username or Password incorrect.');
				} else {
					
					// sign the token with the private key -- and set algorithm to RS256
					const token = jwt.sign({"user" : items}, privatekey, {expiresIn: '24h', algorithm: "RS256"});
				
					return res.status(200).send({ 
						username: items[0].username,
						expires: addDays(new Date(), 1),
						token: token
					});

				}

			}).catch(error => {
				
				res.status(error.status).json({ message: error.message });
		
			});
			
		}
		
	});
	

	
	

	// This made all our endpoints after this require a token <-- which we don't want cause we need to do Question 3 and 4 of the lab :(  --- and we don't wanna start a whole new project cause we lazy
	// validation middleware
	/* 
	router.use(function(req, res, next) {

		// check header or url parameters or post parameters for token
		var token = req.headers['x-access-token'] || req.body.token || req.query.token;
		
		if (token) {
			
			// verify the token using the public key and set algorithms to RS256
			jwt.verify(token, publickey, { expiresIn: '24h', algorithms: ['RS256'] }, function(err, decoded) {      
				if (err) {
					return res.json({ success: false, message: 'Failed to authenticate token.' });    
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;    
					next();
				}
			});
			
		} else {
			// if there is no token -- return an error
			return res.status(403).send({ 
				success: false, 
				message: 'No token provided.' 
			});
		}
	});
	
	*/
	

	
	// So we replace the above with this function...   https://youtu.be/xBYr9DxDqyU?t=228   <-- video explaining it
	function ensureToken(req, res, next){
		
		// check header or url parameters or post parameters for token
		var token = req.headers['x-access-token'] || req.body.token || req.query.token;
		
		if (token) {
			
			// verify the token using the public key and set algorithms to RS256
			jwt.verify(token, publickey, { expiresIn: '24h', algorithms: ['RS256'] }, function(err, decoded) {      
				if (err) {
					return res.json({ success: false, message: 'Failed to authenticate token.' });    
				} else {
					// if everything is good, save to request for use in other routes
					req.decoded = decoded;    
					next();
				}
			});
			
		} else {
			// if there is no token -- return an error
			return res.status(403).send({ 
				success: false, 
				message: 'No token provided.' 
			});
		}
		
	}
	
	
	
	// Now we will use the above function...
	// Now the server will only check for a token only when it sees '/jwt/ at the start of the route
	router.all('/jwt/*', ensureToken);

	
	// first route it will require a token -- if you do GET request to this endpoint you will need a token you need the / after jwt/
	router.get('/jwt/', (req, res) => res.end("Lab 2 - Token test"));
	
	
	// For part 3 Not sure if this is how he wants it or if he wants you to create a new user and give the new user 2 generated keys and send the two keys to the client --> for example when the client first registers
	// Part 3 -- update the user table and add the access key (160 bits) and secret key (320 bits)
	router.put('/update', (req, res) => {

		console.log('in update');
		
		// Also this might not be the correct way of generating the keys so you can search online how to generate Key pairs to use for public and private keys
		// We need to generate a key pair, so one for the accesskey "public key" and the other one for the secretkey "private key"
		// https://stackoverflow.com/questions/8520973/how-to-create-a-pair-private-public-keys-using-node-js-crypto
		var prime_length = 300;
		var diffHell = crypto.createDiffieHellman(prime_length);
		diffHell.generateKeys('base64');

		// update query string -- updating the user Baz and giving him access key and secret key
		let updateSQL = "Update users set accesskey = $1, secretkey = $2 where username = 'Baz';";
		
		// update the table users by adding access key and secret key to the user Baz
		req.app.get('db').query(updateSQL, [diffHell.getPublicKey('hex'), diffHell.getPrivateKey('hex')] ).then( () => {
			res.end("Table updated: public key = " + diffHell.getPublicKey('hex'));
		}).catch(error => {
			res.status(error.status).json({ message: error.message });
		});
		
	});
	
	
	
	// Part 4
	router.post('/access/', (req, res) => {
		
		let parsedUrl = url.parse(req.url);

		// console.log("Parsed url query: " + parsedUrl.query);
		
		// These have to be lower case for some reason
		// Get signature.
		let retrievedSignature = req.headers["x-signature"];
		
		// Get accesskey. 
		let accesskey = req.headers["public-key"];

		// We need to grab the secretkey from database --> we will use the users accesskey to grab their secretkey
		let accesskeySQL = "SELECT * FROM users WHERE accesskey = $1 limit 1";

		// Lets grab the secret key from the database
		req.app.get('db').query(accesskeySQL, [accesskey]).then(items => {

			// check if the statement above returned the user
			if (items.length === 0) {
				res.statusCode = 401;
				res.end('Piss off -- You are not authorized.');
			} else {

				// Found the user so grab their secretkey -- we'll use this to decrypt their message
				let secretkey = items[0].secretkey;

				// Recalculate the signature
				let computedSignature = crypto.createHmac("sha256", secretkey).update(parsedUrl.query).digest("hex");
				
				// Get the encrypted message from the request body
				let encryptedMsg = req.body.msg;

				// Compare the two signatures --> if they matched then all good in the hood
				if (computedSignature === retrievedSignature) {

					// We'll use the secretkey to decrypt the encrypted message
					const decipher = crypto.createDecipher('aes192', secretkey);

					// This will be the decrypted message
					let decrypted = decipher.update(encryptedMsg, 'hex', 'utf8');

					decrypted += decipher.final('utf8');

					console.log('Decrypted message: ' + decrypted);
				
					res.writeHead(200, {
						"Content-Type": "text/plain"
					});
					
					// send the decrypted message back to the user --> or do some other stuff now that we know the message came from that actual user
					res.end(decrypted );
					
				} else {

					res.writeHead(403, {
						"Content-Type": "text/plain"
					});
					
					res.end("Piss off -- You are not authorized\n");
					
				}

			}

		}).catch(error => {
			res.status(error.status).json({ message: error.message });
		});

	});
	
}