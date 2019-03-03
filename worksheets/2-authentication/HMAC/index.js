const express = require('express')
const app = express()
const port = 3000
const massive = require('massive')
const crypto = require('crypto');

massive({
  host: 'localhost',
  port: 5432,
  database: 'lab2',
  user: 'postgres',
  password: 'postgres',
  ssl: false,
  poolSize: 10
}).then(instance => {app.set("db", instance);});

app.get('/', function(req, res){
    res.sendfile('index.html');
});

app.get('/home', (req, res) => {
	req.app.get("db").query("select id from users where username = ${username} AND password = crypt(${password}, password);",
		{username : req.query.username, password: req.query.password}).then(items => {
			if(items.length>0)
			{
				req.app.get("db").query("select secret_key from apikeys where access_key = ${a_key};",
				{a_key: req.query.a_key}).then(results => {
					if(results.length>0)
					{
						const hmac = crypto.createHmac('sha256', results[0].secret_key);
						hmac.update(req.query.message);//hashes message with stored secret key
						const client_hmac = crypto.createHmac('sha256', req.query.s_key);
						client_hmac.update(req.query.message);//hashes message with passed in secret key
						const c_hash = client_hmac.digest('hex');
						const d_hash = hmac.digest('hex');
						console.log("Client hmac: " + c_hash);
						console.log("Database hmac: " + d_hash);
						if(c_hash == d_hash)//compares the two hashes
						{
							console.log("Hashes match, user authenticated!");
							res.status(200);
							req.app.get("db").query("select * from products;").then(products => {res.json(products);});
						}
						else{console.log("Hashes do no not match!");res.sendStatus(401)};//if secret keys hashed with message do not match
					}
					else{console.log("No matching access key");res.sendStatus(401)};//if no matching access key
				});
			}			
			else{console.log("Wrong username/password");res.sendStatus(401)};//if no matching username and password
		});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))