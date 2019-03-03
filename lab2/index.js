const express = require('express')
const massive = require('massive')
const app = express()
const port = 3000
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies 

secret = 'supperrrr secret'

const checkToken = (req, res, callback) => {
        const auth_header = req.headers['authorization'];

        if(typeof auth_header !== 'undefined') {
            const bearer = auth_header.split(' ');
            const token = bearer[1];

            req.token = token;
            callback();
        } else {
            res.status(401).send("Invalid token")
            return
        }
}


massive({
  host: 'localhost',
  port: 5432,
  database: 'pgguide',
  user: 'postgres',
  password: 'password'
}).then(instance => {
	app.set('db', instance);
	app.get('/login', (req, res) => {
		// user: passs passord: passs
		if (req.query.user && req.query.password) {
			query = "SELECT password = crypt('" + req.query.password + "', password) FROM account WHERE username='" + req.query.user + "';"

			req.app.get('db').query(query).then(result => {
				if (result.length > 0){
					if(result[0]['?column?'] == true) {
						res.send('logged in');
					} else {
						res.send('invalid login');
					}
				} else {
					res.send('invalid login.')
				}
			});

			
		} else {
			res.send('Please provide a user and password');
		}
		//query = 'select email, details from users ORDER BY created_at DESC'

		//req.app.get('db').query(query).then(users => {
		//	console.log(req.query.id)
		//	// console.log(users);
		//	res.json(users);
		//});
		
	});

	app.post('/register', function (req, res) {
		if (req.body.user && req.body.password) {
			query = "INSERT INTO account (username, password, public_key, secret_key) VALUES ('" + req.body.user + "', crypt('" + req.body.password + "', gen_salt('md5')), 2, 5556);";
			console.log(query);
			req.app.get('db').query(query).then(() => {
				res.send('registered');
			});
		} else {
			res.send('Please provide a user and password');
		}
	})


	var hmac=crypto.createHmac('sha256', '5556')
	hmac.update('{"product_title":"Dictionary"}');
	console.log('Sig: ' + hmac.digest('hex'));

	app.get('/protected', (req, res) => {	
		console.log(JSON.stringify(req.headers));
		console.log('body: ' + JSON.stringify(req.body));
		if (req.headers.public_key && req.headers.signature && req.body) {
			query = "SELECT secret_key from account where public_key='" + req.headers.public_key + "';";
			req.app.get('db').query(query).then(result => {
				console.log(result)
				var secret = result[0]['secret_key']
				console.log(secret)
				console.log(JSON.stringify(req.body));
				var hmac = crypto.createHmac('sha256', String(secret));
				hmac.update(JSON.stringify(req.body));
				digest = hmac.digest('hex')
				if (digest === req.headers.signature) {
					console.log("Signature matches")
				}else {
					console.log("Signature DOESN'T MATCH");
					console.log(digest)
					console.log(req.headers['signature'])
					res.send('Sig dont match')
					return;
				}
			});

			console.log(req.body.product_title);

			if (req.body.product_title) {
				query = "SELECT * from products WHERE title='" + req.body.product_title + "';";
				req.app.get('db').query(query).then(result => {
					res.send(JSON.stringify(result));
				});
			} else {
				res.send('please send the product title')
			}
		} else {
			res.send('please set public and signature header and req body');
		}
	})




     app.get('/authlogin', (req, res) => {
        if (req.query.user && req.query.password) {
            query = "SELECT user_id, username FROM account WHERE password = crypt('" + req.query.password + "', password);"
            req.app.get('db').query(query).then(result => {
                if(result[0]['user_id'] != null) {
                    jwt.sign({id : result[0]['user_id'] ,username : result[0]['username']}, secret, { expiresIn: '24h' },(err, token) => {
                    if(err) { 
                        console.log(err) 
                    }
                        res.send({id : result[0]['user_id'] ,username : result[0]['username'],token, message : req.query.user + " has logged in"});
                    });
                } else {
                    res.send('invalid login');
                }
            });

        } else {
                res.send('Missing user or pass');
        }
    });


     app.get('/products', checkToken, (req, res) => {
        jwt.verify(req.token, secret, async (err, authorizedData) => {
            if(err){
                res.sendStatus(401);
            } else {
                responseData = await req.app.get("db").query("select * from products;");
                res.status(200).send(responseData);
            }
        })
    })


	app.listen(port, () => console.log("Example app listening on port ${port}!"));
});




