const express = require('express');
const massive = require('massive');
const jwt = require('jsonwebtoken');
const app = express();
const keypair = require('keypair');
app.use(express.urlencoded());
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
			res.set('Authorization', 'Bearer ' + token);
			res.send("\"res\":\"Logged in\"")
		}
		else{
			throw "Failed to log in"
		}
	})
	.catch(err => {res.status(500); console.log(err);res.send("\"error\":\"Error logging in\"");});
});

app.get('/video-games', (req, res) => {
	if(req.headers.authorization == null){
		res.status(401);
		res.send("\"error\":\"Not Autheticated\"");
	}
	else{
		token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, pair.public, function(err, decoded) {
			if(err == null){
				res.status(200);
				res.send("Hello");
				console.log(JSON.stringify(decoded));
				return;
			}
		})
	}
});

app.listen(port, () => console.log('Example app listening on port 3000!'));