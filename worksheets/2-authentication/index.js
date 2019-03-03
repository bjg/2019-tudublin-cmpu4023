var express = require("express");
var app = express();
var http = require('http');
var massive = require("massive");
var connectionString = "postgres://postgres:Barang03@localhost/lab2";
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var auth = require('./auth');

app.all('/hmacauth/*', auth.guardEndpointHMAC);


massive(connectionString).then(massiveInstance => {
    app.set('db', massiveInstance);
    http.createServer(app).listen(3000);

 app.get("/users",(req,res) =>{
        massiveInstance.query("select * from users")
            .then((result) =>{
              
                res.send(result);
            })
    });


 app.get("/products",(req,res) =>{
        massiveInstance.query("select * from products")
            .then((result) =>{
              
                res.send(result);
            })
    });

 auth.generateToken = (user) => {
  return jwt.sign({ user, expiry: "86400"}, secret); //expires in 24 hours
}

app.post('/login', (req, res) => {
  var username = req5.body.username;
  var password = req.body.password;
  var query = 'SELECT * FROM users WHERE username = lower(:username) AND \
    password = crypt(:password, password);';
  massiveInstance.query(query, { replacements: { username, password } })
    .then((result) => {
      if (result[0].length == 0) {
        res
        .status(401)
        .json(response('Failed', 'Incorrect password or username'))
      } else {
        const token = auth.generateToken(result[0][0])
        res.send(response('Sucess', 'Successful Authentication', {
          'token': token
        }))
      }
    })
    .catch(() => {
      res
        .status(401)
        .json(response('Failed', 'Incorrect password or username'))
    });


    auth.guardEndpoint = (req, res, next) => {
      var authHeader = req.headers.authorization;
      var token = auth.getBearerToken(authHeader);
      if (auth.verifyToken(token)) {
        req.token = token;
        next();
      } else {
        res
          .status(401)
          .json({
            'status': 'Failed',
            'message': 'Invalid token',
          })
      }
    }

    // parse bearer token from header
    auth.getBearerToken = (authHeader) => {
       return authHeader.split(' ')[1] || null;
    }

    auth.verifyToken = (token) => {
      try {
        var decoded = jwt.verify(token, secret);
        return true;
      } catch(err) {
        return false;
      }
    }

});

    app.post('/hmac/register', (req, res) => {
      var password = req.body.password;
      var username = req.body.username;
      var accesskey = auth.keyGen(160); // access key
      var sharedSecret = auth.keyGen(320); // sharedSecret
      var insert = "INSERT INTO users (username, password, accesskey, sharedsecret) VALUES \
        (:username, crypt(:password, gen_salt('bf', 8)), :accesskey , :sharedSecret);";
      massiveInstance.query(insert, { replacements: { username, password, accesskey, sharedSecret } }).then(() => {
        res.send(response("Sucess", "Successfully registered", { accessKey: accesskey, sharedSecret: sharedSecret }))
      });
    });

    app.get('/hmacauth/test', (req, res) => {
      res.send(response('Success', 'Authentication via HMAC successful'));
    });

});