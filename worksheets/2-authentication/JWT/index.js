// CREATE TABLE users (
//     ID int NOT NULL PRIMARY KEY,
//     username varchar(255),
//     password varchar(255)
// );

// CREATE TABLE products (
//     ID int NOT NULL PRIMARY KEY,
//     name varchar(255),
//     price varchar(255)
// );

// create extension pgcrypto;

// INSERT INTO users (id, username, password) VALUES (1, 'user1', crypt('password1', gen_salt('bf', 8)));
// INSERT INTO users (id, username, password) VALUES (2, 'user2', crypt('password2', gen_salt('bf', 8)));
// INSERT INTO users (id, username, password) VALUES (3, 'user3', crypt('password3', gen_salt('bf', 8)));

// INSERT INTO products (id, name, price) VALUES (1, 'product1', '300.00');
// INSERT INTO products (id, name, price) VALUES (2, 'product2', '250.00');
// INSERT INTO products (id, name, price) VALUES (3, 'product3', '125.00');

// SELECT * FROM users WHERE username='user1' AND password = crypt('password1', password);


// CREATE OR REPLACE FUNCTION findUser(_username TEXT, _passwd TEXT)
// RETURNS int
// AS $$
//     SELECT u.id
//     FROM users u
//     WHERE u.username = _username
//     AND u.password = crypt(_passwd, u.password);
// $$ LANGUAGE SQL STRICT IMMUTABLE;


const express = require('express')
const app = express();
const port = 3000;
const massive = require('massive');
var jwt = require('jsonwebtoken');
let conn = require('./conn.json');
var cookieParser = require('cookie-parser');


app.use(cookieParser());

massive({
  host: conn.host,
  port: conn.port,
  database: conn.database,
  user: conn.user,
  password: conn.password,
  poolSize: conn.poolSize
}).then(instance => {
  console.log("Connected to the database");
  app.set('db', instance);
});


app.get('/', (req, res) => res.send('Hello World!'))

app.get('/login', function (req, res) {
  var username = req.query.username;
  var password = req.query.password;
  req.app.get('db').query('SELECT * FROM findUser(\''+username+'\',\''+password+'\');')
  .then(items => {
    if(items[0]['finduser'] != null){
      var user = {id: items[0]['finduser']};
      // then return a token, secret key should be an env variable
      const token = jwt.sign({ jti: user.id }, conn.secret_key, { expiresIn: '15h' });
      res.cookie('auth',token);
      res.json({
        message: 'Authenticated! Go to /products',
        token: token
      });
      // res.json(id_json);
    }else{
      res.json("Incorrect Login");
    }
    
  });
});

app.get('/checkCookie',  function (req, res) {
  var cookie = req.cookies.auth;
  if(cookie){
    res.send("Yes" + cookie);
  }else{
    res.send("No cookie present");
  }
});


app.get('/clearCookie',  function (req, res) {
  res.clearCookie("auth");
  res.send("Cookie cleared");
});

// get all purchases
app.get('/products', ensureToken, function (req, res) {
  
  res.json({
    description: 'Protected information. Congrats!'
  });
});

function ensureToken(req, res, next) {
  var cookie = req.cookies.auth;
  if (typeof cookie !== 'undefined') {
    req.token = cookie;
    jwt.verify(req.token, conn.secret_key, function(err, data) {
      if (err) {
        console.log("err token")
        res.sendStatus(403);
      } else {
        next(); 
      }
    });
  } else {
    console.log("Undefined");
    res.sendStatus(403);
  }
}




app.listen(port, () => console.log(`Example app listening on port ${port}!`))
