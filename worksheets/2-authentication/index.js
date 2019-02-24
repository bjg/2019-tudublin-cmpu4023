const express = require('express');
const massive = require('massive');
const jwt = require('jsonwebtoken');
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
		if(verified == false){
			res.status(401);
			res.send("\"error\":\"Incorrect user name or password\"")
		}
		else if(verified == true){
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
			console.log(token);
			res.setHeader('Access-Control-Allow-Origin', 'localhost:3000');
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
			res.cookie('token', token, {httpOnly : false});
			//req.session.token = token;
			res.send("\"res\":\"Logged in\"")
		}
		else{
			throw "Failed to log in"
		}
	})
	.catch(err => {res.status(500); console.log(err);res.send("\"error\":\"Error logging in\"");});
});

app.use('/video-games', (req, res, next) => {
	
	if(req.cookies.token == null){
		res.status(401);
		res.send("\"error\":\"Not Autheticated\"");
	}
	else{
		let token = req.cookies.token;
		jwt.verify(token, pair.public, function(err, decoded) {
			if(err != null){
				res.status(401);
				res.send("\"error\":\"Not Autheticated\"");
				return;
			}
			if(err == null){
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
				
			}
			else{

			}
		})	
	}
});

app.get('/video-games', (req, res) => {
	app.get("db").video_games.find({})
	.then(result => {
		res.status(200);
		res.json(result);
	})
	.catch(error => {console.log(error);res.send("\"error\":\"No Games\"");});
});

app.listen(port, () => console.log('Example app listening on port 3000!'));