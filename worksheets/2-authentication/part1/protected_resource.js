/*
Part 1

Postgres:
	CREATE TABLE users (id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY, username text NOT NULL, password text NOT NULL);
	INSERT INTO users (username, password) VALUES('adam', crypt('pass', gen_salt('bf', 8)));
	INSERT INTO users (username, password) VALUES('joe', crypt('pass', gen_salt('bf', 8)));

Authentication features demonstration:
*/

const express = require('express')
const massive = require('massive')
const app = express()
const port = 3000

massive({
	host: 'localhost',
	port: 5432,
	database: 'lab02',
	user: 'postgres',
	password: 'pass',
	ssl: false,
	poolSize: 10
}).then(instance => {
	app.set('db', instance)

	app.post('/products', async (req, res) => {
		var username = req.query.username
		var password = req.query.password
		const db = req.app.get('db')
		try {
			auth_query = 'select password = crypt($2, password) as result from users where username = $1'
			authenticate = await db.query(auth_query, [username, password])
			var output
			if(authenticate.length && authenticate[0].result)
				res.send(await db.query('select * from products'))
			else
				res.send("Forbidden")
		} catch(err) {
			console.log(err)
		}
	})

	app.listen(port, () => console.log(`App is listening on port ${port}!`))
})
