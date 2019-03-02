const express = require('express');
const massive = require('massive');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bodyParser = require("body-parser");
const moment = require('moment');
const PORT = 3000
const app = express();

//Setting up the app's port the JWT token global varibale and the body parser to parse JSON
app.listen(PORT);
app.set('jwtTokenSecret', 'secret');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

massive
(
    {
	    host: 'localhost',
        port: 5432,
        database: 'authentication',
        user: 'aaron',
        password: 'Password',
        enhancedFunctions: true
    }
)
.then(instance =>{
        db = instance;
    });
  //**                             */
 //**           PART 2 OF LAB     */
//**                             */

//Login end point that will check that the user has entered a name and password then authenicate again teh database.
app.post('/login', function(req,res){
  //local variables for the email and password
  let email,userPassword;
  email = req.query.email;
  userPassword = req.query.password;

  //check to make sure the user has entered an email and password if not send back 401 and ask them to enter a username and password
  if(email == undefined || userPassword == undefined){
    res.status(401).json({status: res.statusCode, payload: "Enter a username/password"});
  }
  //else if they have entered a username and password verify they exists in that database
  else
  {
    db.authenticate(email,userPassword)
    .then(userID => {
      if(userID != null){
        var expires = moment().add(1, 'days');
        //async call for jwt
        jwt.sign(
          {
            auth:  'magic',
            agent: req.headers['user-agent'],
            expiresIn: expires,
            sub: userID
          }, app.get('jwtTokenSecret'),
          (err,token)=>{
            res.json({
              "result": "Authentic User",
              "status": 200,
              "userid": userID,
              "expiresIn": expires,
              token
            });
          });
        }else{
          res.status(401).json({status: res.statusCode, payload: "Incorrect login details"});
        }
      });
      ////How I generated the token orignally calling a generate funciton
      //   let token = generateToken(req,userID);
      //   //send back a status response with the token
      //   res.status(200).json({status: res.statusCode, userid: userID, expires: token.expires, token});
      // });
    }
  });

//// How i orignally generated the JWT token with 24 hour expiry date, the auth and the userID.
// function generateToken(req, userID){
//   var expires = moment().add(1, 'days');
//   return jwt.sign({
//     auth:  'magic',
//     agent: req.headers['user-agent'],
//     expires: expires,
//     sub: userID
//   }, app.get('jwtTokenSecret'))};

//products endpoint to test the JWT token authorisation
app.get('/videogames', function(req,res){
  //call the validate function to check for the bearer token and retuen a reponse code
  let valid=validate(req,res);
  //if code 200 was returned continue with the database query
  if(valid === 200){
    db.query("select * from videogames;")
    .then(users =>{
      res.status(200).json({status: res.statusCode, payload: users});
    })
  }else{
    return  res.status(401).json({status: res.statusCode});
  }
});
//posting to the personal table
app.post('/videogames',function(req,res){
  //call to validate the bearear token passed in
  let valid = validate(req, res);
  if(valid === 200){
    db.query("INSERT INTO videogames(name,price,rating) VALUES ($(_name),$(_price),$(_rating))", {_name:req.query.name,_price:req.query.price,_rating:req.query.rating})
    .then(item =>{
      res.status(200).json({status: res.statusCode});
    })
  }
})

// validate the bearer token supplied in request header
function validate(req, res) {
  //get the header and remove Bearer
  let token = req.headers.authorization;
  if(token == undefined){
    return  res.status(401).json({status: res.statusCode});
  }
  else{
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length);
    }
    //try verify the token with its secret if there is an error return 401
    try {
      var decoded = jwt.verify(token, app.get('jwtTokenSecret'));
    } catch (e) {
      return  res.status(401).json({status: res.statusCode});
    }
    //if decoded is null or the decoded.auth is not magic then return user does not exist
    if(!decoded || decoded.auth !== 'magic') {
      return  res.status(401).json({status: res.statusCode});
    } else {
      return 200;
    }
  }
}

  //**                             */
 //**        PART 4 OF THE LAB    */
//**                             */

//encode endpoint to encode a message and send back a signature for testing the /hmacproducts endpoint. 
app.get('/encode', function(req,res){
  let accessKey = req.headers.access;
  let message = req.body.message;
  db.query("select secretkey from users where accesskey ='"+accessKey+"';")
  .then(SK =>{
    let secretK = SK[0].secretkey; 
    let hash = crypto.createHmac('SHA256', secretK).update(message).digest('hex');
    res.status(200).json({status: res.statusCode, payload: hash});
  })
});

///products endpoint post a product to the products table with passed parameters. 
app.post('/products', function(req,res){
  let accessKey = req.headers.access;
  db.query("select secretkey from users where accesskey ='"+accessKey+"';")
  .then( SK => {
    let secretK = SK[0].secretkey;
    let match = verifyHMAC(secretK,req);
    if(match === 200)
    {
      db.query("INSERT INTO products(name,price) VALUES ($(_name),$(_price))", {_name:req.query.name,_price:req.query.price})
      .then(item =>{
        res.status(match).json({status: res.statusCode, payload:"Insert successful"});
      })
      .catch(() => {
        return  res.status(401).json({status: res.statusCode, payload: "Please enter name and price values"});
      })
    }else if(match === 401){
      return  res.status(match).json({status: res.statusCode, payload: "Message has been tampered with"});
    }
  })
});

//get products endpoint
app.get('/products', function(req,res){
  let accessKey = req.headers.access;
  if(accessKey == undefined){
    return  res.status(401).json({status: res.statusCode, reason:res.statusMessage});
  }else{
    db.query("SELECT * from products")
    .then(items =>{
        res.status(200).json({status: res.statusCode, payload: items});
      })
    }
});

//function to verify that the message being sent is correct and hasn't been tampered with
function verifyHMAC(secretK,req){
  let signature = req.headers.signature;
  let bodymessage = req.body.message;
  let comparison = crypto.createHmac('SHA256',secretK).update(bodymessage).digest('hex');
  if(signature === comparison)
  {
    return 200;
  }
  else{
    return 401;
  }
}

console.log("Visit: http://127.0.0.1:" + PORT);