/*
Parts 3 & 4

Part 3 Postgres

Extend users table:
alter table users add column keys hstore;

Update a user adding 160 bit access key and 320 bit secret key:
update users set keys = '"access_key" => "]$fJ#QYai!3xAK8y>|gb",
"secret_key" => "f9)=}cl$0=h$[InY2;s=k$p%C#0zSj{)7-]BdbKf"' where username = 'adam';

Part 4:
*/

const express = require('express')
const massive = require('massive')
const app = express()
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');
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

	app.use(bodyParser.urlencoded({
    extended: true
	}));

	app.use(bodyParser.json());

  	app.post('/products', async(req, res) => {
    const db = req.app.get('db')
      // res.send(await db.query('select * from products'))

    var access_key = req.body.access_key
    var message = req.body.message
    var hmac = req.body.hmac

    var getUserKeysQuery = `select keys -> 'access_key' as access_key, keys -> 'secret_key' as secret_key 
    from users where keys -> 'access_key' = $1`
    if(hmac && access_key) {
    	userKeys = await db.query(getUserKeysQuery, access_key)
    	if(userKeys.length) {
    		var toBeHashed = userKeys[0].access_key + message
    		var computed_hmac= crypto.createHmac('sha256', userKeys[0].secret_key).update(toBeHashed).digest('hex')
    		//console.log('computed_hmac: ' + computed_hmac)
    		if(computed_hmac == hmac) {
    			products = await db.query('select * from products')
    			res.send(products)
    			return
    		}
    	}
    }
    res.statusCode = 401
    res.send('Authentication failed! Please check the request')
	})

	app.listen(port, () => console.log(`App is listening on port ${port}!`))
})