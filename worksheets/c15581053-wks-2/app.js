const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser')
const app = express();
const port = 3000;
const massive = require('massive');

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

massive({
    host: 'localhost',
    port: 5432,
    database: 'lab2',
    user: 'jack',
    password: 'orbien',
    ssl: false,
    poolSize: 10,
}).then(instance => {
    app.set('orb', instance)

    app.get('/api', (req, res) => {
        res.json({
            message: 'Welcome to my api'
        });
    });


    app.get('/api/getUserByID', async (request, response) => {
        const id = request.body.id;
        console.log(id)
        const users = await request.app.get('orb').query('SELECT * FROM userData WHERE id = $1',[id]);
        response.json(users);
    });


    app.post('/api/products', jwtVerify, async(req, res) => {
        jwt.verify(req.token, 'hiddenkey', {expiresIn: "1h"}, async(err, userData) => {
            if(err) {
                res.sendStatus(403)
            } else {
                id = req.body.id;
                const products = await req.app.get('orb').query('SELECT * FROM productsSafe WHERE id = $1',[id]);
                res.json({
                    message: 'DB Connection Result',
                    products
                });
            }
        });

    });

    app.post('/api/login', async(req,res) =>  {

        username = req.body.username;
        password = req.body.password;
        console.log(username+" "+password)
        const user = await req.app.get('orb').query('SELECT * FROM userdata WHERE username = $1 AND password = crypt($2, password)',[username,password]);
        console.log(user)
        jwt.sign({user: user}, 'hiddenkey', async(err, token) => {
            res.json({
                token: token
            });
        });
    });

    //Json web token verification
    function jwtVerify(req, res, next) {
        const bearerHeader = req.headers['authorization'];

        //Check not empty
        if(typeof bearerHeader !== 'undefined') {
            //seperate by space
            const bearer = bearerHeader.split(' ');
            //token will be 2nd value of array
            const token = bearer[1];
            req.token = token;
            //Next middleware
            next();
        } else {
            res.sendStatus(403);
        }

    }

    app.post('/api/hmac', (req, res) => {

        const headerAuth = req.headers.authorization;
        const accesskey = req.body.accesskey;

        const message = accesskey + req.body.message;
    
        console.log(message);
        //https://nodejs.org/api/crypto.html
        // HMAC key
        const crypto = require('crypto');
        const secret = 'orbijack';
        const hash = crypto.createHmac('sha256', secret);
        hash.update(message);
    
        const check = hash.digest('hex');
    
        console.log(check);
        console.log(hash);
    
        if(check == headerAuth){
            res.json({ message: "Secure access to DB confirmed"});
        }else{
            //Failed 
            res.sendStatus(403);
        }
      });


    app.listen(port, () => console.log(`The Example app listening on port: ${port}!`))

})
