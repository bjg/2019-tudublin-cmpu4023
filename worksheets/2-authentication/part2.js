//  Max MacDonald
//  C15740661

const express = require("express");
const massive = require("massive")
const jwt = require("jsonwebtoken")
const bodyParser = require("body-parser")

const app = express()
const port = 3000
app.use(bodyParser.json())

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgcrypt',
  user: 'Max',
  password: 'Audioslave1!',
  ssl: false,
  poolSize: 10
}).then(instance => {
	app.set("db", instance)
})

app.get('/', (req, res) => res.send('Lab 2: Part 2'))

// Publicly-accessible login to generate token
app.post("/login", (req, res) => {
	let query
    query = req.app.get('db').findUserbyPassword([req.query.username, req.query.password],
	    function(err, result){if(err){ return next(err) }})
	query.then(item => {
		user = item
		if(user === undefined || user.length == 0){
			res.status(401).send("User not found")
		} else {
			var token = jwt.sign({username:user[0].username}, 'supersecret',{expiresIn: 600})
			res.status(200).send(token)
		}
	})
})

// View specific product, not protected with authentication
app.get("/products/:name", (req, res) => {
	req.app.get('db').products.find({name: req.params.name},{
	}).then(items => {res.json(items)
	})
})

// View all products, protected with authentication
app.post("/products", authenticate, (req, res) => {
	req.app.get('db').products.find({},{
	}).then(items => {res.status(200).json(items)
	})
})

// Authentication middleware for protected endpoints
function authenticate(req, res, next) {
	header = req.header('authorization')
	token = header.slice(7,)
	jwt.verify(token, 'supersecret', function(err, decoded){
		if(!err){
		  next()
		} else {
		  res.status(401).send("Authentication failed")
		}
	})
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))