const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const app = express();
const port = 3000;
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

let current_user = "";
let urlencodedParser = bodyParser.urlencoded({ extended: false});

const massive = require('massive');

massive({
	host: 'localhost',
	port: 5432,
	database: 'wks2',
	user: 'postgres',
	password: 'toor1234',
	ssl: false,
	poolSize: 10
}).then(db => {
	app.set('db', db);

	app.get('/', (req, res) => res.send('Home')
	);

	app.get('/register', (req, res) => {
		res.sendFile(path.join(__dirname+'/templates/create_user.html'));
	});

	app.post('/register', urlencodedParser, (req, res) => {
		let username = req.body.username;
		let password = req.body.password;

		if(!username || !password){
        	res.send('No username or password provided');
    	}
		db.query("INSERT INTO users (username, hashedpw) values ('" + username + "' ,crypt('" + password +"', gen_salt('md5')));").then(user => {
			res.send('User created.');
		}).catch(err => {
			res.send('Username taken.')
		})
	});

	app.post('/login', (req, res) => {
		let username = req.query.username;
		let password = req.query.password;
		db.query("SELECT * FROM users WHERE username=${username} AND hashedpw=crypt(${password}, hashedpw);", { username: username, password: password }).then(user => {
			if (Object.keys(user).length === 0) {
				res.status(401).send({
	            	login_success: false,
	            	msg: 'Incorrect credentials.'
        		});
			} else {
				jwt.sign({ username: username }, 'secretKey', { expiresIn: '24hrs'}, (err, token) => {
					current_user = user.username;
					res.status(200).json({
			        	login_success: true,
			        	message: 'Token created.',
			        	token: token,
			        	user: user
		    		});
				});
			}
		});
	});

	app.get('/protected', verifyToken, (req, res) => {
    	jwt.verify(req.token, 'secretKey', (err, data) => {
	        if (err) {
	            res.sendStatus(401);
	        } else {
	            res.json({
	                msg: 'Token verified - Protected information.',
	                data: data
	            });
	        }
    	});
	});

	app.post('/update', verifyToken, (req, res) => {
		jwt.verify(req.token, 'secretKey', (err, data) => {
	        if (err) {
	            res.sendStatus(401);
	        } else {
	            db.query("UPDATE users SET username = ${new_name} WHERE username='test'", {new_name: req.query.name, current_user: current_user}).then(result => {
	            	res.send("Username updated")
	            })
	        }
    	});
	});

	app.listen(port, () => console.log(`REST API app listening on port ${port}!`));
});


function verifyToken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined') {
	    const bearer = bearerHeader.split(' ');
	    const bearerToken = bearer[1];
	    req.token = bearerToken;
	    next();
  	} else {
    	res.sendStatus(403);
  	}
}