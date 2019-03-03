const express = require('express')
const app = express()
const port = 3000
const massive = require('massive')
const jwt = require('jsonwebtoken');


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
	req.app.get("db").query("select id from users where username = ${username} and password = crypt(${password}, password);;",
		{username : req.query.username, password: req.query.password}).then(items => {
			if(items.length>0){
			res.status(200),
			jwt.sign({user_id: items, expiry_stamp: new Date().addHours(1)}, 'secretkey', { expiresIn: '1h' }, (err, token)=>{
			console.log({
			token: token}), res.sendfile('home.html')}
			);}
			else{res.sendStatus(401)};
});});

app.get('/products', verifyToken, (req, res) => {
	jwt.verify(req.token, 'secretkey', (err, auth)=>
	{
		console.log(req.headers);
		if(err)
		{
			res.sendStatus(401);
		}
		else
		{			
			console.log(auth);
			req.app.get("db").query("select * from products;").then(items => {res.json(items);});
			res.status(200);
		}
	})
});


function verifyToken(req, res, next)
{
	const bearerHeader = req.headers['authorization'];
	if(typeof bearerHeader!= 'undefined')
	{
		const bearer = bearerHeader.split(' ');
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	}
	else
	{
		res.sendStatus(401);
	}
}

Date.prototype.addHours= function(h)
{
    this.setHours(this.getHours()+h);
    return this;
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))