const express = require('express')
const app = express()
const port = 3000
const massive = require('massive');

massive({
  host: 'localhost',
  port: 5432,
  database: 'lab2',
  user: 'postgres',
  password: 'postgres',
  ssl: false,
  poolSize: 10
}).then(instance => {
	app.set("db", instance);
});



app.get('/', (req, res) => res.send('Lab2 P1'))

//using hashed password with gen_Salt to create users
	app.post('/users', (req, res) => {
		console.log(req.body.username);
		console.log(req.body.password);
		var user = req.body.username
		var pass = req.body.password
		let query
		query = db.query(`insert into users (username, password) values ('${user}', crypt('${pass}', gen_salt('bf', 8))) returning username;`)
					return query.then(items => res.send('User has been made'))
	});

//match hashed passwords with crypt	
	
app.post('/products', (req, res) => {
    let query
    query = req.app.get('db').findUserbyPassword([req.query.username, req.query.password],
	    function(err, result){if(err){ return next(err); }});
	query.then(item => {
		user = item
		if(user === undefined || user.length == 0){
			return res.send('error:does not match try again')
		} else {
			req.app.get('db').products.find({},{
			}).then(items => {res.json(items);
			});
		};
	});
});

app.listen(port, () => console.log(` ${port}!`))

});


	