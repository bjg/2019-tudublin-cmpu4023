const express = require('express')
const app = express();
const port = 3000;
const massive = require('massive');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser');


app.use(cookieParser());

massive({
  host: 'localhost',
  port: 5432,
  database: 'lab2',
  user: 'admin1',
  password: 'password',
  ssl: false,
  poolSize: 10
})
.then(instance => {app.set("db", instance)})
.catch(error => {console.log("Failed to connect to server")});

app.get('/', (req, res) => res.send('What\'s up world World!'))

app.get('/login', function (req, res) {
  var user = req.query.username;
  var pass = req.query.password;
  req.app.get('db').query('SELECT * FROM findUser(\''+user+'\',\''+pass+'\');')
  .then(items => {
    if(items[0]['finduser'] != null){
      var user = {id: items[0]['finduser']};
      const token = jwt.sign({ jti: user.id }, 1234, { expiresIn: '24h' });
      res.cookie('auth',token);
      res.json({
        message: 'Access Granted',
        token: token
      });
    }else{
      res.json("Login Failed");
    }
    
  });
});

app.get('/products', ensureToken, function (req, res) {
  
  res.json({
    description: 'Welcome to Products'
  });
});

function ensureToken(req, res, next) {
  var cookie = req.cookies.auth;
  if (typeof cookie !== 'undefined') {
    req.token = cookie;
    jwt.verify(req.token, conn.secret_key, function(err, data) {
      if (err) {
        console.log("Token Error")
        res.sendStatus(403);
      } else {
        next(); 
      }
    });
  } else {
    console.log("Undefined Token");
    res.sendStatus(403);
  }
}

app.get('/checkCookie',  function (req, res) {
  var cookie = req.cookies.auth;
  if(cookie){
    res.send("Yes" + cookie);
  }else{
    res.send("Someone ate all the cookies..");
  }
});


app.get('/clearCookie',  function (req, res) {
  res.clearCookie("auth");
  res.send("Cookie cleared");
});

app.listen(port, () => console.log(`Connected on ${port}!`))

