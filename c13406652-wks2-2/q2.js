const express = require('express')
const jwt = require("jsonwebtoken")
const app = express()
const port = 3000
const massive = require('massive');
var bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

massive({
  host: 'localhost',
  port: 5432,
  database: 'lab2',
  user: 'postgres',
  password: 'postgres',
  ssl: false,
  poolSize: 10
}).then(db => {

	app.get('/', (req, res) => res.send('Lab2 P2'))

	// login for tokens
	app.post("/sign in", (req, res) => {
		console.log(req.body.username);
		console.log(req.body.password);
		var user = req.body.username
		var pass = req.body.password
		let query
			query = db.query(`SELECT username, password FROM users WHERE username = '${user}' AND password = crypt('${pass}', password);`)
		query.then(next => {
			if(next.length == 0){
				return res.send('Incorrect username or password')
			}
			const token = jwt.sign({username:user[0].username}, 'abigsecret',{expiresIn: 86400})
			res.status(200).send(token)
		});
	})
})
	// display products with authenticatgion 
	app.post("/products", authenticate, (req, res) => {
		req.app.get('db').products.find({},{
		}).then(items => {res.status(200).json(items)
		})
	})

	// Authentication middleware for protected endpoints
	function authentication(req, res, next) {
		token = req.body.token
		jwt.verify(token, 'bigsecret', function(err, decoded){
			if(!err){
			  next()
			} else {
			  res.status(401).send('incorrect token. no validation')
			}
		})
	}
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))