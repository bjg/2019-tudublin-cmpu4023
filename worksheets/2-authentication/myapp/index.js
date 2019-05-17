const express = require('express');
const http = require('http');
const massive = require('massive');
const fs = require("fs");
const jwt = require('jsonwebtoken');
// Required for curl requests
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const priKey = fs.readFileSync("keys/jwtRS256.key");
const pubKey = fs.readFileSync("keys/jwtRS256.key.pub");

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'wks2',
  user: 'postgres',
  password: 'password'
}).then(instance => {
  app.set('db', instance);

  var token;

  app.get('/', (req, res) => {
    res.send("Lab 2 Enterprise Application Develpment");
  });

  /*
  Sample curl request to login:
    curl -i -X POST -H "Content-Type: application/json" -d 
    '{ "username":"batman", "password":"BruceWayne" }'
    localhost:3000/login
  */
  app.post('/login', (req, res) => {
    instance.query(
      "select * from users where username = $1 AND password = crypt($2, password)", [req.body.username, req.body.password]
    ).then(users => {
      token = jwt.sign({username: users[0].username}, priKey, {expiresIn: '24h', algorithm: 'RS256'});
      res.status(200).send(token);
    }).catch(error => res.sendStatus(401));
  });

  app.get('/cars/:id', (req, res) => {
    instance.query(
      "select * from cars where id = $1", [req.params.id]
    ).then(cars => {
      if (cars.length != 0) {
        res.status(200).send(cars);
      }
      else {
        res.status(200).send("Not a valid ID!");
      }
    }).catch(error => res.sendStatus(400));
  })

  /*
  Use the returned JWT Token from the login request and execute statement
  using below example's format:
    curl -i -X POST 
    -H "Authorization: BEARER "--JWT TOKEN--"
    -H "Content-Type: application/json"
    -d '{ 
      "id":6, 
      "model":"Golf", 
      "make":"Volkswagen", 
      "year":2015, 
      "price":14000
    }'
    localhost:3000/cars
  */
  app.post('/cars', authenticate, (req, res) => {
    console.log(req.body.id);
    instance.cars.insert({
      id: req.body.id,
      model: req.body.model,
      make: req.body.make,
      year: req.body.year,
      price: req.body.price
    }).then(cars => res.status(201).send("Added the car " + cars.make + " " + cars.model + " with id " + cars.id));
  });

  http.createServer(app).listen(3000);
});

function authenticate(req, res, next) {
  if (req.headers.authorization === undefined) {
    res.sendStatus(403);
  }
  else {
    var authHeader = (req.headers.authorization).split(" ");
    var jwtToken = authHeader[1];
    jwt.verify(jwtToken, pubKey, (error, authorized) => {
      if (error) {
        res.sendStatus(401);
      }
      else {
        next();
      }
    })
  }
}