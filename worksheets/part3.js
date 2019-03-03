const express = require("express");
const massive = require("massive");
const CryptoJS = require("crypto-js");
const bodyParser = require('body-parser');
const Base64 = require("crypto-js/enc-base64");

const app = express();
const port = 3000

app.use(bodyParser.json());

massive({
  host: 'localhost',
  port: 5432,
  database: 'pgcrypt',
  user: 'tasyaoc',
  password: 'C00lp0rt',
  ssl: false,
  poolSize: 10
}).then(instance => {
	app.set("db", instance)
})

app.get('/', (req, res) => res.send('Lab 2: Part 3'))

// View specific product, not protected with authentication
app.get("/products/:name", (req, res) => {
	req.app.get('db').products.find({name: req.params.name},{
	}).then(items => {res.json(items)
	})
})

// This endpoint must be protected with authentication
app.post("/products", authenticate, (req, res) => {
	req.app.get('db').products.find({},{
	}).then(items => {res.status(200).send(items)
	})
});

// Authentication middleware for protected endpoints
function authenticate(req, res, next) {
    header = req.header('authorization')
	key = header.slice(16,26) 
	req.app.get('db').users.find({access: key},{
		fields: ["secret"],
    }).then(item => {
		if( item === undefined || item.length == 0) {
			res.status(401).send("Authentication failed")
		} else {
			combo = 'http://' + req.header('host') + req.url + req.body.value + key
			if(header.slice(37,) === Base64.stringify(CryptoJS.HmacSHA256(combo, item[0].secret))){
			  next()
			} else {
			  res.status(401).send("Authentication failed")
			}
		}
    });
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`))