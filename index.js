const jwt = require('jsonwebtoken')
const express = require('express')
const massive = require('massive')
const monitor = require('pg-monitor')
const crypto = require('crypto')
const bodyparser = require('body-parser')
secret1 = 'dark_necessities'
const app = express();

app.use(bodyparser.json())

massive('postgres://postgres:Flanker7@localhost:5432/lab2db').then(db => {
  monitor.attach(db.driverConfig);


  //Lab 2 part

    app.post('/addproduct', verifyToken, (req, res) => {

        const product = {
            name: req.query.name,
            manufacturer: req.query.manufacturer
        }
        jwt.verify(req.token, secret1, (err, authenticationData) => {
            if(err){
                res.sendStatus(403);
            } else {
                //actually run the db query to insert etc
                db.query("INSERT INTO products (name, manufacturer) VALUES ($1, $2)", [product.name, product.manufacturer]).then(result => {
                    res.json(result)
                });
            }
        });
    });

    app.post('/login', (req, res, next) => {

        const usr = {
            name: req.query.name,
            password: req.query.password
        }

        db.query("SELECT * FROM users WHERE name = $1 AND password = crypt($2, password)", [usr.name,usr.password]).then(result => {
            if(result.length > 0) {
                jwt.sign({usr: usr}, secret1, { expiresIn: '24h' }, (err, token) => {
                    res.json({
                        token
                    });
                });
            } else {
                res.sendStatus(401);
            }
        });
    });


    //Lab 2 part 4

    app.post('/hmac', (req, res, next) => {

        const clienthmac = req.headers.authorization;

        const accesskey = req.body.accesskey;
        const jsonbody = req.body.data;
        const signature = accesskey+jsonbody;

        db.query("SELECT secretkey FROM users WHERE accesskey = $1", [accesskey]).then(result =>{
            if(result.length > 0){
                const secretKey = result[0].secretkey
                const hash = crypto.createHmac('sha256', secretKey)
                hash.update(signature)
                const serverHmac = hash.digest('hex');
                        if(serverHmac == clienthmac){
                            res.sendStatus(200);
                            db.query("INSERT INTO products (name, manufacturer) VALUES ($1, $2)", [jsonbody, jsonbody])
                        }else{
                            res.sendStatus(401);
                        }
            }
        })
    });

    //Authorization: Bearer <token(access)>

    function verifyToken(req, res, next){
        //get authentication header value
        const bearerHeader = req.headers['authorization'];
        if(typeof bearerHeader != 'undefined'){
            const bearer = bearerHeader.split(' ');
            const bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            //Forbidden
            res.sendStatus(403);
        }
    }

    app.listen(4000, () => console.log('Server listening on port 5432'))
});