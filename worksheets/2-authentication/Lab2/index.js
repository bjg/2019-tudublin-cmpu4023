const Sequelize = require('sequelize');
const sequelize = new Sequelize('lab2', 'erika', '12ambionG', {
    host: 'localhost',
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
});

const express = require('express');
const http = require('http');
const massive = require('massive');
const jwt = require('jsonwebtoken');
const Users = require('./models').users;
const models = require('./models/index');
port = 3000;

const app = express();

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'lab2',
  user: 'postgres',
  password: '12ambionG'
}).then(instance => {
  app.set('db', instance);

app.get('/users', async(req, res) => {
	  const users = await req.app.get('db').query('select * from users ORDER BY email DESC;');
	  res.json(users);
  });

app.get('/products',async(req, res) => {
    const result = await req.app.get('db').query("select * from products ORDER BY name ASC")
    res.json(result);
  });

app.get('/products/protected', ensureToken ,async(req, res) => {
    const result = await req.app.get('db').query("select * from products ORDER BY name ASC")
    jwt.verify(req.token, 'my_secret_key', function(err,authorizedData){
    	if(err){
    		res.sendStatus(401);
    	}else{
    		res.json({
    			text: result,
    			authorizedData
    		});
    	}
    })
    res.json(result);
  });

app.post('/api/login',async(req, res) => {
    /*const email = req.body.email;
    const password = req.body.password;*/
    const { body } = req;
    const { email } = body;
    const { password } = body;

    //checking to make sure the user entered the correct username/password combo
    if(email === users.email && password === users.password) { 
        //if user log in success, generate a JWT token for the user with a secret key
        jwt.sign({email}, 'privatekey', { expiresIn: '23h' },(err, token) => {
            if(err) { console.log(err) }    
            res.send(token);
        });
    } else {
        console.log('ERROR: Could not log in');
    }
    const token = jwt.sign({username}, 'my_secret_key',{expiresIn:"23h"});
    res.json({
    	token: token
    });
  });

/*function ensureToken (req,res,next)
{
	const _header = req.headers["authorization"];
	if(typeof _header !== 'undefined'){
		const bearer = _header.split("");
		const bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	} else {
		res.sendStatus(403);
	}
}*/

//Check to make sure header is not undefined, if so, return Forbidden (403)
function ensureToken (req, res, next) {
    const header = req.headers['authorization'];

    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}

app.listen(port, () => console.log('Example app listening on port ${port}!'));
});