const express = require('express')
const app = express()
const port = 3000
const massive = require('massive');
var bodyParser  = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

massive({
  host: 'localhost',
  port: 5432,
  database: 'labtwo',
  user: 'postgres',
  password: 'postgres',
  ssl: false,
  poolSize: 10
}).then(db => {

	app.get('/', (req, res) => res.send('Post to /users and /books'))

	/*Use gen_salt to has password
	Install pgcrypt extension and create users table
	see sql in documentation*/
	app.post('/users', (req, res) => {
		console.log(req.body.username);
		console.log(req.body.password);
		var user = req.body.username
		var pass = req.body.password
		let query
			query = db.query(`insert into users (username, password) values ('${user}', crypt('${pass}', gen_salt('bf', 8))) returning username;`)
		return query.then(items => res.send('User created!'))
	});

	/*match hashed passwords using crypt() before selecting from books table*/
	app.post('/books', (req, res) => {
		console.log(req.body.username);
		console.log(req.body.password);
		var user = req.body.username
		var pass = req.body.password
		let query
			console.log(`SELECT username, password FROM users WHERE username = '${user}' AND password = crypt('${pass}', password);`)
			query = db.query(`SELECT username, password FROM users WHERE username = '${user}' AND password = crypt('${pass}', password);`)
		query.then(next => {
			if(next.length == 0){
				return res.send('Incorrect username or password')
			}
			db.books.find({},{
				}).then(books => {res.send(books);
			});
		});
	});

app.listen(port, () => console.log(`Part one on port ${port}!`))

});