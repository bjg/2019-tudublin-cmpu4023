/*
Student Number: C15440858
Module: Enterprise Application Development
Lab: 2
*/

const express = require('express');
const jwt = require('jsonwebtoken');
const massive = require('massive');
const monitor = require('pg-monitor');
const decode = require('jwt-claims');
const crypto = require('crypto');
const bp = require('body-parser')
const app = express();
const port = 3000

massive(`postgres://postgres:admin@localhost:5432/Lab2`).then(db => {
  monitor.attach(db.driverConfig);

var connectionString = "postgres://massive:admin@localhost/chinook";
app.use(bp.json())



///Question 1
/*
CREATE EXTENSION pgcrypto;
CREATE TABLE USERS (name text not null, password text not null);
INSERT INTO USERS (name, password) VALUES ('Shane', crypt('shelly', gen_salt('bf5', 5)));

CREATE TABLE PRODUCTS (name text not null, price numeric not null);
INSERT INTO PRODUCTS (name, price) VALUES ('Apple', 0.50);
INSERT INTO PRODUCTS (name, price) VALUES ('Banana', 0.40);
*/



///Question 2
//Add product with valid JWT
app.put('/add_product/', verifyToken, (req, res) => 
{
	const product = 
	{
		uname: req.query.name,
		pword: req.query.price
	}
	
	jwt.verify(req.token, 'secretkey', (err, authData) => 
	{
		if(err)
		{
			res.sendStatus(403);
		}
		else
		{
			db.query("INSERT INTO PRODUCTS (name, price) VALUES ($1, $2)",[req.query.name, req.query.price]).then(result => 
			{
				res.json(result);
			});
		}
	});
});

//Login
app.post('/login/', (req , res) => 
{        
	const user = 
	{
		uname: req.query.username,
		pword: req.query.password
	}
	
	//Authenticate User 
	db.query("SELECT * FROM users WHERE name = $1 AND password = crypt($2,password)", [req.query.username, req.query.password]).then(result =>
	{
		if (result.length >= 1 )
		{
			jwt.sign({user: user}, 'secretkey', { expiresIn: '24h' }, (err,token) =>
			{
				const claims = decode(token)
				const resJSON = 
				{
					uname: claims.user.uname,
					iat: claims.iat,
					exp: claims.exp
				}
	
				res.json({
					token,
					claims
				})
			})
		}
		else 
		{
			res.sendStatus(401)
		}
	})
})

//Verify Token
function verifyToken(req, res, next)
{
	//Get auth header value.
	const bearerHeader = req.headers['authorization'];
	
	//Check if bearer is undefined.
	if(typeof bearerHeader !== 'undefined')
	{
		//Split the token.
		const bearer = bearerHeader.split(' ');
		
		//Get the token from array.
		const bearerToken = bearer[1];
		
		//Set the token.
		req.token = bearerToken;
		next();
	}
	else
	{
		res.sendStatus(403);
	}
}



///Question 3
/*
ALTER TABLE USERS ADD accesskey text, ADD secretkey text;
UPDATE USERS SET accesskey = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', secretkey = 'BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB' WHERE name = 'Shane';
*/



///Question 4
app.delete('/drop_product_hmac', (req, res) => 
{
	const clientHMAC = req.headers.authorization //'cfaa26178c061cb1bbaa914e710f0093cf4b7088ee513737fdf8bca37579c134'
	const accesskey = req.body.accesskey // 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'
	const product = req.body.product //'Pear'
	const bodymessage = accesskey + product

	db.query("SELECT secretkey FROM users WHERE accesskey = $1",[accesskey]).then(result => 
	{
		if(result.length >= 1)
		{
			//Do server encryption to create the clientHMAC.
			const secretkey = result[0].secretkey
			const HMAC = crypto.createHmac('sha256', secretkey)
			HMAC.update(bodymessage)
			const serverHMAC = HMAC.digest('hex')
			
			//If server HMAC is the same the client HMAC.
			if(serverHMAC == clientHMAC)
			{
				//Delete the specified product.
				db.query("DELETE FROM PRODUCTS WHERE name = $1",[product]).then(result =>
				{
					res.json(result);
				})
			}
			else
			{
				//Error
				res.sendStatus(401)
			}
		}
		else
		{
			//Error
			res.sendStatus(401)
		}
	})
});


//Notify server running.
app.listen(5000, () => console.log('Server started on port 5000'))
});