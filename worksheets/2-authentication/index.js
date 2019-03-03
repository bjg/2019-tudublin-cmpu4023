const express = require('express');
const app = express();
const port = 3000;
const massive = require('massive');
const http = require('http');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

var db;

massive({
  host: 'localhost',
  port: 5432,
  database: 'worksheet2',
  user: 'thomas',
  password: 'Password',
  ssl: false,
  poolSize: 10,
}).then(instance => {
  db = instance;
});

//function to validate bearer token
function validate(req, res, next) {
  try {
    //remove word BEARER from token, verifies input token token using secret key and HS256 algorithm
    var decoded = jwt.verify(req.headers.authorization.split(" ")[1], 'thomas', { algorithm: 'HS256'});
  } catch (e) {
    return res.status(401).json({ status: res.statusCode, error: 'NOT AUTHENTICATED' });
  }
  if(!decoded) {
    //if not verified
    return res.status(401).json({ status: res.statusCode, error: 'NOT AUTHENTICATED' });
  } else {
    //if verified return to route
    next();
  }
}

//function to generate signature with a secret key and an array of options
//if any option is undefined, then do not include it in the string to be encrypted
function generateSignature(key, options){
  let value = options.forEach(option => {
    if (option != undefined){
      key += option;
    }
  });

  //encrypt signature using sha256
  let hmac = crypto.createHmac('sha256', key);

  //return as hex string
  return hmac.digest('hex');
}

//route to login
app.get('/login', (req, res) => {
  //parametised query to verify login details
  db.query("select * from authenticate($1, $2);", [req.query.username, req.query.password])
  .then(items => {
    //if login successful
    if (items[0]['authenticate'] != null){

      //asynchronously generate token
      jwt.sign(
      {
        //time created at is now
        iat: Math.floor(Date.now() / 1000),
        //subject is the user id
        sub: items[0]['authenticate'],
        //token will expire in 24 hours
        expiresIn: '24h'
      },
      //created using secret key encrypted using HS256
      'thomas',
      {
         algorithm: 'HS256'
      }, (err, token) => {
        //when token is generated, return a 200 with login successful
        res.status(200).json({ status: res.statusCode, result: "Login Successful", token: token });
      });
    }
    else{
      //if incorrect login, return 401 with error message
      res.status(401).json({ status: res.statusCode, error: 'Incorrect Login Details' })
    }
  });
});

//get products using token method
app.get('/products', validate, (req, res, next) => {
  //if token is valid, then return 200 with data
    db.products.find({}).then(items => {
      res.status(200).json({ status: res.statusCode, payload: items });
    });

});

//get products using token method
app.put('/products', validate, (req, res, next) => {
  //if token is valid, then return 200 with data
    db.products.update({
      title: req.query.currentTitle
    },{
      title: req.query.newTitle
    }).then(items => {
      res.status(200).json({ status: res.statusCode, payload: items });
    });

});


//get proudcts uisng HMAC method
app.get('/products2', (req, res) => {
  //get secret key using access key
  db.users.find({
    access_key: req.headers.key
  }).then(items => {
    //generate signature using secret key and query param
    if (generateSignature(items[0]['secret_key'], [req.headers.key, req.query.title]) == req.headers.signature){
      if (req.query.title == undefined){
        //if title isnt included, then just return all products
        db.products.find({}).then(items => {
          res.status(200).json({ status: res.statusCode, payload: items });
        });
      }
      else{
        //if title included, select specific product by title
        db.products.find({
          title: req.query.title
        }).then(items => {
          res.status(200).json({ status: res.statusCode, payload: items });
        });
      }
    }
    else{
      //return not authenticate error
      res.status(401).json({ status: res.statusCode, error: 'NOT AUTHENTICATED' });
    }
  }).catch(e => {
    //return not authenticate error
    res.status(401).json({ status: res.statusCode, error: 'NOT AUTHENTICATED' })
  });
});

//route to update a product using title
app.put('/products2', (req, res) => {
  //get secret key using access key
  db.users.find({
    access_key: req.headers.key
  }).then(items => {
    //generate singature using message body and query param
    if (generateSignature(items[0]['secret_key'], [req.headers.key, req.query.title, req.body.title]) == req.headers.signature){
        //if authenticated then update
        db.products.update({
          title: req.query.title,
        },{
          title: req.body.title
        }).then(items => {
          //return 200 with data
          res.status(200).json({ status: res.statusCode, payload: items });
        });
    }
    else{
      //return not authenticate error
      res.status(401).json({ status: res.statusCode, error: 'NOT AUTHENTICATED' });
    }
  }).catch(e => {
    //return not authenticate error
    res.status(401).json({ status: res.statusCode, error: 'NOT AUTHENTICATED' })
  });
});

app.get('/', (req, res) => res.send('Hello World!'));


app.listen(port, () => console.log(`Example app listening on port ${port}!`));
