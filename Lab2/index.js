const express = require('express');
const http = require('http');
const massive = require('massive');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'Lab2',
  user: 'Thomas',
  password: 'cronin98'
}).then(instance => {
  app.set('db', instance)
  
  /*
	I used postman to do the posy calls and to include authentication in the header
	field. Run the post login/Thomas2898 (Thomas2898 exist in my sql code) to
	generate a token, it will return a token in the cmd window. Take this token and
	place it in the header authorization field and call the get /products and it will
	return the contents of the products table. Token also expires in 24 hours 
	
	
	For hmac, call hmac with this in the body
	{
		"access" : "y$B&E)H@McQfTjWnZr4t",
		"message" : "Yes"
	}
	this will return a signature
	call hmacCheck with 
	{
		"access" : "y$B&E)H@McQfTjWnZr4t",
		"message" : "Yes",
		"hash" : "signature returned from calling hmac"
	}
	This works without the "message as well
  */
  
  //Can only access the products using a user token that is generted when calling /login
  app.get('/products', validateToken, (req, res) => {
  
	jwt.verify(req.userToken, 'privateKey', function(err, decoded) {
		if(err){
			res.json({
				Error : 404
			});
		}
		else{
			console.log(decoded.user)
			req.app.get('db').products.db.query(
			"select * from products"
			).then(items => {
				res.json(items);
			});
		}
	});
	//res.json(bearer);
  });
  
  bodyParser = require('body-parser').json();
  
  //Used to test the JWT authentication
  app.put('/products', validateToken, bodyParser, (req, res) => {
  
	jwt.verify(req.userToken, 'privateKey', function(err, decoded) {
		if(err){
			res.json({
				Error : 404
			});
		}
		else{
			console.log(decoded.user)
			console.log(req.body.name)
			console.log(req.body.newName)
		}
	});
	//res.json(bearer);
  });
  
  //Used to validate the token
  //Where i leaned how to spilt a string https://stackoverflow.com/questions/15134199/how-to-split-and-modify-a-string-in-nodejs
  function validateToken(req, res, next) {
   
    var bearerToken = req.headers.authorization;
    //console.log("MESSAGE")
	//Used to see what the token returned if there is no token given or the token doesnt exist
    //console.log(bearerToken)
    if(typeof bearerToken == "undefined"){
		res.json({
			Error : 404
		});
	}
	else{
		//Split is used to split a string (to split bearer and the token)
		//in this case is splits the string when there is a space and creates an array out of the string
		var authToken = req.headers.authorization.split(" ")[1];
		req.userToken = authToken;
		next();
	}
	
	//Tried this way first but it didnt work
	/*
	try {
		jwt.verify(authToken, 'privateKey', function(err, decoded) {
		console.log(decoded.user)
	});
	  } catch (e) {
		return authFail(res);
	  }
    return (res, authToken);
	*/
}

  var user_token;
  
  //Login used to generate a key to be used as authentication for viewing products
  app.post('/login/:name',bodyParser, (req, res, err)=>{
	/*
	const user = {
	username : 'Thomas2898'
	}
	*/
	
	/*
    req.app.get('db').users.db.query(
	"select id from users where username =  "+"'"+req.body.username+"'"
	).then(items => {
		res.json(items);
    });
	*/
	
	console.log(req.body.username)
	req.app.get('db').users.findOne({
	username : req.params.name
    }).then(items => { 
      //res.json(items);
	  if(items == null){
		res.json({
			Error : 'User not found'
		});
	  }
	  else{
		const user = {
		userID : items.id
		}
		
		//Creating a token that will expire in 24 hours
		jwt.sign({user}, 'privateKey', { expiresIn: '24h' }, function(err, token) {
			console.log(token);
			//Place this in a header field when calling /products, like bearer token
			user_token = token;
		});
		//res.json(items.id);
		res.json({
			Status : '200 OK'
		});
		
	  }
    });

	/*
	req.app.get('db').users.find({username : 'Thomas2898'}, function(err, user){
		//returns the first match
		if(err){
			res.json({
				Error : 404
			});
		}
		else{
			console.log(user)
		}
    });
	*/
	
	/*
	//res.json(userDetails);
	jwt.sign({user}, 'privateKey', { expiresIn: '24h' }, function(err, token) {
		console.log(token);
    });
	*/
	
  });
  
  
  
  
  /*
  ##############################
  HMAC PART
  ##############################
  */
  
  
  //Used to check hmac authentication
  app.post('/hmacCheck',bodyParser, (req, res) => {
	//var user_key = "y$B&E)H@McQfTjWnZr4t";//Access key that is sent by the user
	//var user_message = "My message";//The message the user has sent
	//var user_message_hash = "fd9aabfbef16367e0d58dfd9eab63cc1b29a168a1f8a58043bbf14f993c04420";//The hased version of the message the user sent
	
	var user_key = req.body.access;//Access key that is sent by the user
	var user_message = req.body.message;//The message the user has sent
	var user_message_hash = req.body.hash;//The hased version of the message the user sent
	
	//Used to find the users secret key by searching the database using the access the the user sent with their message
	req.app.get('db').users.findOne({
	access_key : user_key
    }).then(items => { 
      //res.json(items.secret_key);
	  if(items == null){
			res.json({
				Error : 'User not found'
			});
		}
		else{
	  
			//Checks signature if message is not included 
		  if(typeof user_message == "undefined"){
			  //This is where i hash the users message with the users secret key that i obtained from the database using the users access key
			  var checkSignature = crypto.createHmac("sha256", items.secret_key).digest("hex");
			  //This is were i check the two hashs to see if what the user is sending has not been touched  or changed
			  if(checkSignature == user_message_hash){
			        console.log("No Message")	
					req.app.get('db').products.db.query(
						"select * from products"
					).then(items => {
						res.json(items);
					});
				}
				else{
					res.json({
						Message : 'Error'
					});
				}
			}
			else{
			  //Checks signature if message is included
			  //This is where i hash the users message with the users secret key that i obtained from the database using the users access key
			  var checkSignature = crypto.createHmac("sha256", items.secret_key).update(user_message).digest("hex");
			  //This is were i check the two hashs to see if what the user is sending has not been touched  or changed
			  if(checkSignature == user_message_hash){
			        console.log("Message")	
					req.app.get('db').products.db.query(
						"select * from products"
					).then(items => {
						res.json(items);
					});
				}
				else{
					res.json({
						Message : 'Error'
					});
				}
			}
		} 
    });
	//var signature = crypto.createHmac("sha256", sharedSecret).update("My message").digest("hex");
	//console.log(signature)
	//res.json(user_key);
  });
  
  //Used to create a signature to test the /hmacCheck 
  app.post('/hmac',bodyParser, (req, res) => {
	var sharedSecret = "2666981AA193C2259B3D833F18DE1";//The users secret key (not sent)
	//var message = "My message";//Message the user is sending
	var message = req.body.message;
	console.log(message);
	
	//If no message is sent 
	if(typeof message == "undefined"){
		var signature = crypto.createHmac("sha256", sharedSecret).digest("hex");
		console.log("No Message")
		console.log(signature)
		res.json(signature);
	}
	else{
		var signature = crypto.createHmac("sha256", sharedSecret).update(message).digest("hex");
		console.log("Message")
		console.log(signature)
		res.json(signature);
	}
  });
  
  http.createServer(app).listen(3000);
});