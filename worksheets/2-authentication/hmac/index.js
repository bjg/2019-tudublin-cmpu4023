const express = require('express');
const http = require('http');
const massive = require('massive');
const cryptoJS = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
// Required for curl requests
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

massive({
  host: '127.0.0.1',
  port: 5432,
  database: 'wks2',
  user: 'postgres',
  password: 'password'
}).then(instance => {
  app.set('db', instance);

  app.get('/', (req, res) => {
    res.send("Lab 2 Enterprise Application Develpment - hmac");
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

  app.post('/cars', authenticate, (req, res) => {
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
      var key = authHeader[1].substring("Key=".length);
      var signature = authHeader[2].substring("Signature=".length);
      massive({
        host: '127.0.0.1',
        port: 5432,
        database: 'wks2',
        user: 'postgres',
        password: 'password'
      }).then(instance => {
        app.set('db', instance);
        instance.query(
            "select secretKey from users where accessKey = $1", [key]
        ).then(sig => {
            // encrypting the secret key from the database to check if it is the
            // same as the signature passed from the request
            var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
            var querySignature = cryptoJS.HmacSHA256(
                fullUrl + JSON.stringify(req.body) + key,
                sig[0].secretkey
            );
            if (Base64.stringify(querySignature) === signature) {
                next();
            }
            else {
                res.sendStatus(401);
            }
        })
      })
    }
  }