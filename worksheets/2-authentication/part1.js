//  Max MacDonald
//  C15740661

const express = require('express')
const app = express()
const port = 3000

const massive = require('massive');

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgcrypt',
  user: 'Max',
  password: 'Audioslave1!',
  ssl: false,
  poolSize: 10
}).then(instance => {
	app.set("db", instance);
});

app.get('/', (req, res) => res.send('Lab 2: Part 1'))

// Create a user with hashed password
app.post('/users', (req, res) => {
	let query
	query = req.app.get('db').createUser([req.query.username, req.query.password],
		function(err, result){if(err){ return next(err); }});
	return query.then(items => res.json(items))
});

// Look up all products if authenticated
app.post('/products', (req, res) => {
    let query
    query = req.app.get('db').findUserbyPassword([req.query.username, req.query.password],
	    function(err, result){if(err){ return next(err); }});
	query.then(item => {
		user = item
		if(user === undefined || user.length == 0){
			return res.send('Please enter the correct username and password combination')
		} else {
			req.app.get('db').products.find({},{
			}).then(items => {res.json(items);
			});
		}
	})
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))