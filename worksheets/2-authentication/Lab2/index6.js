const Sequelize = require('sequelize');
const sequelize = new Sequelize('lab2', 'erika', '12ambionG', {
    host: 'localhost',
    dialect: 'postgres',
  
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
});
//file reading
const fs = require("fs");
const path = require("path");
const models = require('./models/index');
const express = require('express');
const app = express();
const port = 3000;
const Users = require('./models').users; //load
const Products = require('./models').products; //load
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const moment = require('moment');
app.use(bodyParser.json());

app.get('/api', function api(req, res) {
  res.json({
    description: 'My API. Please authenticate!'
  });
});

//for the async algorithm
const private_key = fs.readFileSync('private.key.pem', 'utf8')
const public_key = fs.readFileSync('public.key.pem', 'utf8')

app.post('/api/login', async (req, res) => {

  /*// insert code here to actually authenticate, or fake it
  const user = { name: 'erika', id: 3 };
  const options = {expiresIn: '5h', algorithm: "RS256"}
  // then return a token, secret key should be an env variable

  const token = jwt.sign(user.name,pkey,options);
  //var expires = moment().add(1, 'days');*/

  // insert code here to actually authenticate, or fake it
  const user = { name: 'erika', id: 3 };

  // then return a token, secret key should be an env variable
  //const payload = {}
  const token = jwt.sign({ user: user.id, expiresIn: '5h'},private_key, { algorithm: 'RS256' });
  res.json({
    message: 'Authenticated! Use this token in the "Authorization" header',
    token: token,
    user: user,
    expiresIn: '5h'
  });
})

//log in with username and password
/*app.post('/api/login', (req, res, next) => {
  let email,userPassword;
  const username = req.body.username;
  const password = req.body.password;

  //checking to make sure the user entered the correct username/password combo
  if(username === Users.username && password === Users.password) { 
      //if user log in success, generate a JWT token for the user with a secret key
      jwt.sign({Users}, 'privatekey', { expiresIn: '23h' },(err, token) => {
          if(err) { console.log(err) }    
          res.send(token);
      });
  } else {
      console.log('ERROR: Could not log in');
  }
});*/

//Get users
app.get('/api/users', ensureToken ,(req, res) => {
  //verify the JWT token generated for the user
  
   jwt.verify(req.token, public_key, { algorithms: 'RS256'}, function(err, data) {
      if(err){
          //If error send Forbidden (403)
          console.log('ERROR: Could not connect to the protected route');
          res.sendStatus(403);
      } else {
          //If token is successfully verified, we can send the autorized data 
          Users.findAll({ all: true, nested: true }).then(function (users) {res.json(users);})
          console.log('SUCCESS: Connected to protected route');
      }
})});

//check token
app.get('/api/protected', ensureToken, (req, res)=> {
  jwt.verify(req.token, 'secret_key_goes_here', function(err, data) {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        description: 'Protected information. Congrats!'
      });
    }
  });
})

app.get("/api", ensureToken, (req, res, next) => {
    res.send({
        status: 200,
        message: "Token has been Verified!",
        token: req.headers["authorization"]
    });
   });//end response

app.get('/api/products', ensureToken ,(req, res) => {
  //verify the JWT token generated for the user
  
   jwt.verify(req.token, public_key, { algorithms: 'RS256'}, function(err, data) {
      if(err){
          //If error send Forbidden (403)
          console.log('ERROR: Could not connect to the protected route');
          res.sendStatus(403);
      } else {
          //If token is successfully verified, we can send the autorized data 
          description: Products.findAll({ all: true, nested: true }).then(function (products) {res.json(products);})
          console.log('SUCCESS: Connected to protected route');
      }
})});

function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
}

/*PART 1
CREATE EXTENSION pgcrypto;

CREATE TABLE users (id serial PRIMARY KEY,username text NOT NULL UNIQUE,password text NOT NULL);

INSERT INTO users (username, password) VALUES('erika', crypt('12345', gen_salt('bf', 8))),('mae', crypt('qwert', gen_salt('bf', 8)));

CREATE TABLE products (id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,name text NOT NULL,price real NOT NULL);

INSERT INTO products (name, price) VALUES('aPad', 900),('aPhone Z', 1200),('Zamson', 800);
*/

/*PART 2
npm install express jsonwebtoken

Async
const private_key = fs.readFileSync('private.key.pem', 'utf8')
const public_key = fs.readFileSync('public.key.pem', 'utf8')

-----BEGIN RSA PRIVATE KEY-----
MIICWwIBAAKBgQDdlatRjRjogo3WojgGHFHYLugdUWAY9iR3fy4arWNA1KoS8kVw
33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQsHUfQrSDv+MuSUMAe8jzKE4qW
+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5Do2kQ+X5xK9cipRgEKwIDAQAB
AoGAD+onAtVye4ic7VR7V50DF9bOnwRwNXrARcDhq9LWNRrRGElESYYTQ6EbatXS
3MCyjjX2eMhu/aF5YhXBwkppwxg+EOmXeh+MzL7Zh284OuPbkglAaGhV9bb6/5Cp
uGb1esyPbYW+Ty2PC0GSZfIXkXs76jXAu9TOBvD0ybc2YlkCQQDywg2R/7t3Q2OE
2+yo382CLJdrlSLVROWKwb4tb2PjhY4XAwV8d1vy0RenxTB+K5Mu57uVSTHtrMK0
GAtFr833AkEA6avx20OHo61Yela/4k5kQDtjEf1N0LfI+BcWZtxsS3jDM3i1Hp0K
Su5rsCPb8acJo5RO26gGVrfAsDcIXKC+bQJAZZ2XIpsitLyPpuiMOvBbzPavd4gY
6Z8KWrfYzJoI/Q9FuBo6rKwl4BFoToD7WIUS+hpkagwWiz+6zLoX1dbOZwJACmH5
fSSjAkLRi54PKJ8TFUeOP15h9sQzydI8zJU+upvDEKZsZc/UhT/SySDOxQ4G/523
Y0sz/OZtSWcol/UMgQJALesy++GdvoIDLfJX5GBQpuFgFenRiRDabxrE9MNUZ2aP
FaFp+DyAe+b4nDwuJaW2LURbr8AEZga7oQj0uYxcYw==
-----END RSA PRIVATE KEY-----

-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDdlatRjRjogo3WojgGHFHYLugd
UWAY9iR3fy4arWNA1KoS8kVw33cJibXr8bvwUAUparCwlvdbH6dvEOfou0/gCFQs
HUfQrSDv+MuSUMAe8jzKE4qW+jK+xQU9a03GUnKHkkle+Q0pX/g6jXZ7r1/xAK5D
o2kQ+X5xK9cipRgEKwIDAQAB
-----END PUBLIC KEY-----
*/

/*PART 3

alter table users ADD COLUMN accessKey text;

alter table users ADD COLUMN secretKey text;

insert into users(username,password,accesskey,secretkey) VALUES ('maciej',crypt('12345', gen_salt('bf', 8)),'44CF9590006BF252F707
','OtxrzxIsfpFjA7SwPzILwy8Bw21TLhquhboDYROV');
*/

app.listen(3000, function () {
  console.log('App listening on port 3000!');
});