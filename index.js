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
	
	
	//THIS IS USED FOR GETTING A SIGNITURE THAT I CAN USE IN POSTMAN TO SEND
	//ACCESS KEY ssUGTLMjhIa22EtwRuoc7c0d0w2U7QdQicbCYpph
	//SECRET KEY 6O46qgwzMSkk9n1fQTljIhsOFi8ei5vKdxSnHqwED4FOAQFPUi1pPexGJxyufRaSB0eFNQ70OFbKdip8
	//FOR USER1
	
	var hmac=crypto.createHmac('sha256', '6O46qgwzMSkk9n1fQTljIhsOFi8ei5vKdxSnHqwED4FOAQFPUi1pPexGJxyufRaSB0eFNQ70OFbKdip8')
    hmac.update('{"product_title":"Desktop Computer"}');
    console.log('Sig: ' + hmac.digest('hex'));
	
	////////////////////////////////////////////////
	
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
	
	//This can be used to verify jwt tokens as middleware
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
	
	app.get('/productsdeletefirst', checkToken, (req, res) => {
		
		jwt.verify(req.token, secret, async (err, authorizedData) => {
            if(err){
                //If error send Forbidden (401)
                console.log('ERROR');
                res.sendStatus(401);
            } else {
                //If toke verifies get data and wait for repsonse before sending
				responseData = await req.app.get("db").query("UPDATE userraccount SET product_title = 'UPDATED' WHERE id = '" req.body.title + "';");
				res.status(200).send(responseData);
				//res.status(200).send(await req.app.get("db").query("select * from products limit 1;"));
                console.log('SUCCESS');
            }
        })
		
		//console.log("FINISHED EXEC")
	})
	
	
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
	
	
	
	app.get('/protected', (req, res) => {
                if (req.headers.accesskey && req.headers.signature && req.body) {
                        query = "SELECT secretkey from useraccount where accesskey='" + req.headers.accesskey + "';";
                        req.app.get('db').query(query).then(result => {
                                console.log(result)
                                var secret = result[0]['secretkey']
								secret = secret.trim()
                                var hmac = crypto.createHmac('sha256', String(secret));
                                hmac.update(JSON.stringify(req.body));
                                localSig = hmac.digest('hex')
                                if (localSig === req.headers.signature) {
                                        console.log("Connecting users signature matched the databases stored one")
                                }else {
                                        res.send('Connecting users signature does not match returning!')
                                        return;
                                }
                        });
                        if (req.body.product_title) {
                                query = "SELECT * from products WHERE title='" + req.body.product_title + "';";
                                req.app.get('db').query(query).then(result => {
                                        res.send(JSON.stringify(result));
                        });
                        } else {
                                res.send('Attach a product title in json format you would like to send')
                        }
                } else {
                        res.send('Public key, Signature not correct cannot access this protected route');
                }
        })
	
	app.listen(port, () => console.log("Example app listening on port ${port}!"));
});

const checkToken = (req, res, next) => {
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
}
