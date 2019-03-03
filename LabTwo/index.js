const express = require('express');
const app = express();
const port = 3000;
const massive = require('massive');
const http = require('http');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
var db;

massive({
  host: 'localhost',
  port: 5432,
  database: 'labTwo',
  user: 'katie',
  password: 'Password',
  ssl: false,
  poolSize: 10,
  enhancedFunctions: true
}).then(instance => {
  db = instance;
});

//Validate token
function validate(req, res, next) {
  try {
    //Remove bearer from token
    var decoded = jwt.verify(req.headers.authorization.split(" ")[1], 'katie', { algorithm: 'HS256'});
  } catch (e) {
    return res.status(401).json({ status: res.statusCode, error: 'NOT AUTHENTICATED' });
  }
  //Check if its verified
  if(!decoded) {
    return res.status(401).json({ status: res.statusCode, error: 'NOT AUTHENTICATED' });
  } else {
    next();
  }
}
//Generate signature
function generateSignature(k, opt){
  let value = opt.forEach(option => {
    if (option != undefined){
      k += option;
    }
  });
  //encrypt with sha256
  let hmac = crypto.createHmac('sha256', k);
  return hmac.digest('hex');
}

app.get('/login', (req, res) => {
  db.query("select * from authenticate($1, $2);", [req.query.username, req.query.password])
  .then(items => {
    if (items[0]['authenticate'] != null){
      //Make token
      jwt.sign(
      {
        iat: Math.floor(Date.now() / 1000),
        sub: items[0]['authenticate'],
        expiresIn: '24h'
      },
      'katie',
      {
         algorithm: 'HS256'
      }, (err, token) => {
        res.status(200).json({ status: res.statusCode, result: "Login Done", token: token });
      });
    }
    else{
      res.status(401).json({ status: res.statusCode, error: 'Login Error' })
    }
  });
});

//get products
app.get('/products', validate, (req, res, next) => {
    db.products.find({}).then(items => {
      res.status(200).json({ status: res.statusCode, payload: items });
    });
});

app.put('/products', validate, (req, res, next) => {
    db.products.update({
      title: req.query.currentTitle
    },{
      title: req.query.newTitle
    }).then(items => {
      res.status(200).json({ status: res.statusCode, payload: items });
    });

});

//get proudcts with HMAC
app.get('/products2', (req, res) => {
  db.users.find({
    access_key: req.headers.k
  }).then(items => {
    if (generateSignature(items[0]['secret_key'], [req.headers.k, req.query.title]) == req.headers.signature){
      //Get all products
      if (req.query.title == undefined){
        db.products.find({}).then(items => {
          res.status(200).json({ status: res.statusCode, payload: items });
        });
      }
      else{
        //Get product by title
        db.products.find({
          title: req.query.title
        }).then(items => {
          res.status(200).json({ status: res.statusCode, payload: items });
        });
      }
    }
    //Errors
    else{
      res.status(401).json({ status: res.statusCode, error: 'Error' });
    }
  }).catch(e => {
    res.status(401).json({ status: res.statusCode, error: 'Error' })
  });
});

//Update products
app.put('/products2', (req, res) => {
  db.users.find({
    access_key: req.headers.k
  }).then(items => {
    if (generateSignature(items[0]['secret_key'], [req.headers.k, req.query.title, req.body.title]) == req.headers.signature){
      //Update it
        db.products.update({
          title: req.query.title,
        },{
          title: req.body.title
        }).then(items => {
          res.status(200).json({ status: res.statusCode, payload: items });
        });
    }
    //Errors
    else{
      res.status(401).json({ status: res.statusCode, error: 'Error' });
    }
  }).catch(e => {
    res.status(401).json({ status: res.statusCode, error: 'Error' })
  });
});

app.listen(port, () => console.log(`Listening on port ${port}!`));