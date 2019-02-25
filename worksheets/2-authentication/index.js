const express = require('express');
const massive = require('massive');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express();
const keypair = require('keypair');
const cookieParser = require('cookie-parser');
app.use(express.urlencoded());
app.use(cookieParser());
const port = 3000;

const pair = keypair();

massive({
  host: 'localhost',
  port: 5432,
  database: 'enterprise',
  user: 'Eoghan Quirke',
  password: 'eoghan',
  ssl: false,
  poolSize: 10
})
.then(instance => {app.set("db", instance)})
.catch(error => {console.log("Failed to connect to server")});

const ISSUER = 'localhost';
const AUDIENCE = 'localhost';


app.post('/login', (req, res) => {
	console.log(req.body.username,req.body.password);
	app.get("db").verify_user(req.body.username, req.body.password)
	.then(result => {
		verified = result[0].verify_user;
		console.log(verified);
		if(verified == null){
			res.status(401);
			res.send("\"error\":\"Incorrect user name or password\"");
			return;
		}
		let signOptions = {
			issuer:  ISSUER,
			subject:  req.body.username,
			audience:  AUDIENCE,
			expiresIn:  "1h",
			algorithm:  "RS256"
		};
		payload = {};
		let token = jwt.sign(payload, pair.private, signOptions);
		res.status(200);
		//console.log(token);
		res.setHeader('Access-Control-Allow-Origin', 'localhost:3000');
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		res.cookie('token', token, {httpOnly : false});
		//req.session.token = token;
		res.send("\"res\":\"Logged in\"");
	})
	.catch(err => {res.status(500); console.log(err);res.send("\"error\":\"Error logging in\"");});
});

app.use('/video-games', (req, res, next) => {
	
	if(req.cookies.token == null){
		res.status(401);
		res.send("\"error\":\"Not Autheticated\"");
		return;
	}

	let token = req.cookies.token;
	jwt.verify(token, pair.public, (err, decoded) => {
		if(err != null){
			res.status(401);
			res.send("\"error\":\"Not Autheticated\"");
			return;
		}

		console.log(JSON.stringify(decoded));
		
		if(req.method == 'POST' || req.method == 'PUT'){
			app.get("db").users.findOne({user_name:decoded.sub})
			.then(result => {
				if(result.user_name != null){
					next();
				}
				else{
					res.status(403);
					res.send("\"error\":\"Not Permitted\"");
				}
			});
		}
		else{
			next();
		}
	})	
});

app.get('/video-games', (req, res) => {
	app.get("db").video_games.find({})
	.then(result => {
		res.status(200);
		res.json(result);
	})
	.catch(error => {console.log(error);res.send("\"error\":\"No Games\"");});
});

app.post('/video-games', (req, res) => {
	app.get("db").query("CALL create_video_game($1, $2, $3)", [req.body.title, parseFloat(req.body.rating), parseFloat(req.body.price)])
	.then(result => {
		res.status(201);
		res.send("\"Success\":\"Created\"");
	})
	.catch(error => {console.log(error);res.send("\"error\":\"No Games\"");});
});

//exchanges key without revealing it to observers
app.post('/hmac-key', (req, res) => {
	let user_id;
	app.get("db").verify_user(req.body.username, req.body.password)
	.then(result => {
		user_id = result[0].verify_user;
		console.log(user_id);
		if(user_id == null){
			res.status(401);
			res.send("\"error\":\"Incorrect user name or password\"");
			return;
		}
		
		const server = crypto.createDiffieHellman(req.body.prime, 'base64', req.body.gen, 'base64');
		const server_key = server.generateKeys();
		const server_secret = server.computeSecret(req.body.key, 'base64');
		
		response = {key:server_key.toString('base64')};
		
		
		app.get("db").query("CALL update_keys($1, $2, $3)", [user_id, server_key.toString('base64').slice(0,28), server_secret.toString('base64')]).
		then(result => {
			console.log("server secret: " + server_secret.toString('base64'));
			console.log(JSON.stringify(response));
			res.status(200);
			res.json(response);
		})
		.catch(error => {console.log(error);
			res.status(401);
			res.send("\"error\":\"Key Gen Error\"");
		})
	})
	.catch(error => {console.log(error);res.send("\"error\":\"Logging in Error\"");});

});

app.post('/hmac-video-games', (req, res) => {
	console.log(JSON.stringify(req.body));
	
	app.get("db").users.findOne({access_key:req.body.access_key})
	.then(result => {
		console.log("users.find :");
		console.log(result);
		
		if(result.secret_key == null){
			res.status(401);
			res.send("\"error\":\"Invalid Access Key\"");
			return;
		}
		
		secret = result.secret_key
		
		hmac = crypto.createHmac('sha1', secret);
		console.log("Secret Key: " + secret);
		console.log("Access_key: " + req.body.access_key);
		console.log("Title: " + req.body.title);
		console.log("Price: " + req.body.price);
		console.log("Rating: " + req.body.rating);
		
		hmac.update(req.body.access_key + req.body.title  + req.body.price + req.body.rating);
		
		server_side_sig = hmac.digest('base64');
		console.log("Signature: " + server_side_sig);
		
		if(req.body.signature != server_side_sig){
			res.status(401);
			res.send("\"error\":\"Invalid Signature\"");
			return;
		}
		
		app.get("db").query("CALL create_video_game($1, $2, $3)", [req.body.title, parseFloat(req.body.rating), parseFloat(req.body.price)])
		.then(result => {
			res.status(201);
			res.send("\"Success\":\"Created\"");
		})
		.catch(error => {console.log(error);res.send("\"error\":\"No Games\"");});
	})
	.catch(error => {
		console.log(error); 
		res.status(401);
		res.send("\"error\":\"Error, signature Invalid\"");
	});
});

app.listen(port, () => console.log('Example app listening on port 3000!'));