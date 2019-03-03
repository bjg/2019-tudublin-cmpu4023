/*
Author : Evgeny Timoshin
StDNum : C15514003

All of the testing to the API has been performed using Postman.
I did not create client for testing as this was a much simpler way to test the API and insured completion.

*/

const express = require('express')
const massive = require('massive')
const app = express()
const port = 2020
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const secret = 'qwerty12345'

var bodyParser = require('body-parser')
app.use( bodyParser.json() );      
app.use(bodyParser.urlencoded({    
  extended: true
}));
app.use(express.json());      
app.use(express.urlencoded());


massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'password'
}).then(instance => {
	app.set('db', instance);
	
	/*
	First two methods used to check if the hashed passwords work and user can register
	*/
	
	app.post('/register', function (req, res) {
		if (req.body.user && req.body.password) {
			query = "INSERT INTO useraccount (username, password) VALUES ('" + req.body.user + "', crypt('" + req.body.password + "', gen_salt('bf',8)));";
			req.app.get('db').query(query).then(() => {
					res.send("User : " + req.body.user + " has registered");
			});
		} else {
			res.send('To register send user and password in body of the POST');
		}
	});

	
	app.get('/login', (req, res) => {
		if (req.body.user && req.body.password) {
			query = "SELECT password = crypt('" + req.body.password + "', password) FROM useraccount WHERE username='" + req.body.user + "';"
			req.app.get('db').query(query).then(result => {
			if(result[0]['?column?'] == true) {
				res.send("user " + req.body.user + "  has logged in");
				} else {
					res.send('invalid login check the user and password keys in the body of GET');
				}
			});


		} else {
				res.send('Need a user and password key to login');
		}
	});
	
	
	//This can be used to verify jwt tokens as middleware instead of invoking a method checkToken() as you will see belllow
	
	
	/*
	app.use(async (req, res, next) => {
		//Log the headers that are passed in to server
		console.log(req.headers)
		
		const header = req.headers['authorization'];

		if(typeof header !== 'undefined') {
			const bearer = header.split(' ');
			const token = bearer[1];

			req.token = token;
			next();
		} else {
			//If header is undefined return Forbidden (403)
			res.status(401).send("Invalid token for login")
			return
		}
	})
	*/
	
	///////////////////////////////////////////////////////////
	//JWT STUFFF
	///////////////////////////////////////
	
	/*
	This is a protected route that requires a hashed password to be cross checked with the data base of users.  Before a JWT can be generated and signed for that user.
	Once this hashed password that is sent in the request is checked , JWT is geenrated and returned to tghe user with a response containing the token
	From here thee user has 23 hours to use the token to log back into the database and access some of the other wise protected routes.
	*/
	
	
	app.get('/authlogin', (req, res) => {
		if (req.body.user && req.body.password) {
			//query = "SELECT password = crypt('" + req.body.password + "', password) FROM useraccount WHERE username='" + req.body.user + "';"
			query = "SELECT id, username FROM useraccount WHERE password = crypt('" + req.body.password + "', password);"
			req.app.get('db').query(query).then(result => {
				//Log to server if the connections password matches database
				console.log(result);
				//Verify that the hashes password matched
				if(result[0]['id'] != null) {
					console.log("USERS INFO")
					console.log(result[0]['username'])
					console.log(result[0]['id'])
					//Create a signed token
					jwt.sign({id : result[0]['id'] ,username : result[0]['username']}, secret, { expiresIn: '23h' },(err, token) => {
						//Check if error occurs and log if so
						if(err) { 
							console.log(err) 
						}
						//Send response in json format, containing the token and a message to the client
						res.send({id : result[0]['id'] ,username : result[0]['username'],token, message : "User" + req.body.user + " has logged in succesfully"});
					});
					
				} else {
					res.send('invalid login check the user and password keys in the body of GET');
				}	
			});

		} else {
				res.send('Need a user and password key to login');
		}
	});
	
	/*
	The three API calls below /products, /productsdeletefirst , /productsupdatetitle
	Are protected routes that use the checkToken() method defined at the bottom of the program code.
	This method runs and makes sure that the request coming in has a valid HTTP autherization header field
	IF this passes the flow of the program can proceed to the api calls and there the JWT token will be verified.
	Once this is complete the JWT verify runs async and repsonds to the user appropriatley.
	*/
	
	app.get('/products', checkToken, (req, res) => {
		
		jwt.verify(req.token, secret, async (err, authorizedData) => {
            if(err){
                //If error send Forbidden (401)
                console.log('ERROR');
                res.sendStatus(401);
            } else {
                //If toke verifies get data and wait for repsonse before sending
				responseData = await req.app.get("db").query("select * from products;");
				res.status(200).send(responseData);
				//res.status(200).send(await req.app.get("db").query("select * from products limit 1;"));
                console.log('CONNECTED');
            }
        })
		
		//console.log("FINISHED EXEC")
	})
	
	app.get('/productsdeletefirst', checkToken, (req, res) => {
		
		jwt.verify(req.token, secret, async (err, authorizedData) => {
            if(err){
                //If error send Forbidden (401)
                console.log('ERROR');
                res.sendStatus(401);
            } else {
                //If toke verifies get data and wait for repsonse before sending
				responseData = await req.app.get("db").query("DELETE FROM useraccount WHERE id = 1;");
				res.status(200).send(responseData);
				//res.status(200).send(await req.app.get("db").query("select * from products limit 1;"));
                console.log('CONNECTED');
            }
        })
		
		//console.log("FINISHED EXEC")
	})
	
	app.get('/productsupdate', checkToken, (req, res) => {
		
		jwt.verify(req.token, secret, async (err, authorizedData) => {
            if(err){
                //If error send Forbidden (401)
                console.log('ERROR');
                res.sendStatus(401);
            } else {
                //If toke verifies get data and wait for repsonse before sending
				responseData = await req.app.get("db").query("UPDATE useraccount SET product_title = 'UPDATED' WHERE id = '" + req.body.title + "';");
				res.status(200).send(responseData);
				//res.status(200).send(await req.app.get("db").query("select * from products limit 1;"));
                console.log('SUCCESS');
            }
        })
		
		//console.log("FINISHED EXEC")
	})
	
	
	////////////////////////////////////////////////////////////////////
	//HMAC AUTHENTICATION
	////////////////////////////////////////////////////////////////////
	
	/*
	To test this API instead of creating a client, I used postman and generated signitures to send locally here. It works perfectly
	
	////This section below should occur on the clients side that is how the signature is generated and send along with the access key in the request
	//// First the secret key is hashed then updated with the body of the request
	
	var hmac=crypto.createHmac('sha256', secretkey)
    hmac.update('{"product_title":"Desktop Computer"}');
    console.log('Signature: ' + hmac.digest('hex'));
	
	/////////////////////////////////////////////
	
	From postman the request had the following :
	Headers :
		Signiture key
		AccessKey key
	Body:{"product_title":"Desktop Computer"}
	
	In practice and production this could be anything as long as the signature generated on the client side (Which it is simulated here)
	and the accesskeys are corrent authentication then works!
	
	The server recieves the generated signature, accesskey and body of message from the client.
	The server then checks the database for the secretkey that matches the accesskey of the user.
	If a match is found the server then computes a Hmac hash from the secret key and the body of the request.
	If this new hash matches the signature then Authentication is succesful.
		
	*/
	
	//The code below generate and logs the scecret, accesskey and also the signature generated.
	//This can be used in postman to send a valid request
	//The database is also updated every time
	
	const accesskey = crypto.randomBytes(20);
	console.log("accesskey :  " + accesskey.toString('hex'));
	const secretkey = crypto.randomBytes(40);
	console.log("secret key that is used for hashing :  " + secretkey.toString('hex'));
	console.log(typeof secretkey.toString('hex'))
	
	var hmac=crypto.createHmac('sha256', secretkey.toString('hex'))
    hmac.update('{"product_title":"Desktop Computer"}');
    console.log('Signature: ' + hmac.digest('hex'));
	
	app.get("db").query("UPDATE useraccount SET accesskey ='" + accesskey.toString('hex') + "', secretkey = '" + secretkey.toString('hex') + "'WHERE id = '" + 1 + "';");
	
	
	app.get('/protectedRoute', (req, res) => {
                if (req.headers.accesskey && req.headers.signature && req.body) {
                        query = "SELECT secretkey from useraccount where accesskey='" + req.headers.accesskey + "';";
                        req.app.get('db').query(query).then(result => {
                                console.log(result)
								
								if(result[0] == null){
									res.status(401).send('Error connection insure signature and access key are attached in the header of request')
									return
								}
                                var secret = result[0]['secretkey']
								secret = secret.trim()
                                var hmac = crypto.createHmac('sha256', String(secret));
                                hmac.update(JSON.stringify(req.body));
								//console.log(JSON.stringify(req.body))
                                localSig = hmac.digest('hex')
                                if (localSig === req.headers.signature) {
                                        console.log("Connecting users signature matched the databases stored one")
										 if (req.body.product_title) {
											query = "SELECT * from products WHERE title='" + req.body.product_title + "';";
											req.app.get('db').query(query).then(result => {
											res.status(200).send(JSON.stringify(result));
										});
										} else {
												res.status(401).send('Attach a product title in json format you would like to send')
										}
                                }else {
                                        res.status(401).send('Connecting users signature does not match returning!')
                                        return;
                                }
                        });
                } else {
                        res.status(401).send('Public key, Signature not correct cannot access this protected route');
                }
        })
	
	app.listen(port, () => console.log("Example app listening on port ${port}!"));
});

const checkToken = (req, res, next) => {
   //Log the headers that are passed in to server
		console.log(req.headers)
		
		const header = req.headers['authorization'];

		if(typeof header !== 'undefined') {
			//splits the header value to find the token
			const bearer = header.split(' ');
			const token = bearer[1];
			
			//Updates the request token to be used for JWT verififcation
			req.token = token;
			next();
		} else {
			//If header is undefined return Forbidden (401)
			res.status(401).send("Invalid token for login")
			return
		}
}
