var express = require('express');
var app = express();
const massive = require("massive");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const port = 3000;
const moment = require("moment");
var bodyparser = require("body-parser");
const CryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");




app.listen(port);
app.set('jwtTokenSecret', 'secret');
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(bodyparser.json());

massive
(
    {
	    host: 'localhost',
        port: 5432,
        database: 'lab2',
        user: 'postgres',
        password: 'password',
        enhancedFunctions: true
    }
)
.then(database =>{
        app.set("db",database);
    });
	
	
//*******Q2******

//authenticate user credentials to login
app.post("/authenticate", (req, res) => {
	let query
    query = req.app.get('db').getusers([req.query.username, req.query.password],
	    function(err, result){if(err){ return next(err) }})
	query.then(item => {
		user = item
		if(user === undefined || user.length == 0){
			res.status(401).send("Error, user not in database!")
		} else {
			var token = jwt.sign({username:user[0].username},'supersecret',{expiresIn: 60*60})
			res.status(200).send(token)
		}
	})
})

// return protected products table if user enters correct login details
app.post('/products', (req, res) => {
    let query
    query = req.app.get('db').getusers([req.query.username, req.query.password],
	    function(err, result){if(err){ return next(err); }});
	query.then(item => {
		user = item
		if(user === undefined || user.length == 0){
			return res.send("incorrect username/password!")
		} else {
			req.app.get('db').products.find({},{
			}).then(fruit => {res.json(fruit);
			});
		}
	})
});


function authentication(req, res, next) {
	header = req.header('authorization')
	token = header.slice(7,)
	jwt.verify(token, 'supersecret', function(err, decoded){
		if(!err){
		  next()
		} else {
		  res.status(401).send("Failed to authenticate!")
		}
	})
}









	
	









