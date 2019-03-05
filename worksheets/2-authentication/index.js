const express = require('express');
const app = express();
const port = 3000;
const massive = require('massive');
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var secret = "mysecretkey";

massive({
	host: "localhost",
	port: 5432,
	database: "lab2",
	user: "postgres",
  password: "piela",
})
.then(instance => {
  app.set("db", instance);
});

app.get('/', (req, res) => res.send('Please use one of the following paths to navigate through the app:'));




// POST call for login at http://localhost:3000/login
app.post("/login",urlencodedParser, (req, res) => {
  req.app
    .get("db")
    .query("select userid from users where username = ${username} AND password = crypt(${password}, password);",
    {
      username: req.body.username,
      password: req.body.password
    })
    .then(query => {
      if(query.length == 0){
        res.json({
          message: 'Incorrect credentials',
          status: 401
        })
        //res.status(404).json(query);
        }else {
          //gives a token
          var token = jwt.sign({
            user: req.body.username,
          }, 
          secret, { expiresIn: '1h' });
            console.log("success")

            
            res.json(token)
        }
    })
  });




// ensure token is of the bearer type + verifies the validity of the token
function ensureToken(req, res, next) {
  //get header values
  var token;
  const headers = req.headers['authorization'];
  console.log(headers);
  if(typeof headers == 'undefined'){
  //jwt.verify(req.token, 'secretkey', (err, authData) => {
  //  if(err) {
    res.json({
      message: "No authorization token provided",
      status: 401
    })
    }else{
    //  req.authData = authData;
      const bearer = headers.split(' ');
      token = bearer[1];
      jwt.verify(token, secret, function(err, decoded){
        if (err){
          //console.log(err);
          req.authenticated = false;
          req.decoded = null;
          res.sendStatus(401);
          console.log("token validation failed")
          //next();
        } else {
          console.log("token validation success")
          req.decoded = decoded;
          req.authenticated = true;
          next();
        }
      });
    }
}

// POST call for login at http://localhost:3000/login
app.get("/products", ensureToken, (req, res) => {
  req.app
    .get("db")
    .query("SELECT * FROM products;")
    
    .then(query => {
      if(query.length == 0){
        res.json({
          message: 'Not authorized',
          status: 401
        })
        //res.status(404).json(query);
        }else {
          console.log("success")
          res.status(200).json(query);
        }
    })
  });



app.listen(port, () => console.log(`Example app listening on port ${port}!`))