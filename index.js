const express = require('express');
const jwt = require('jsonwebtoken');
const bp = require('body-parser');
const massive = require('massive');
const promise = require('bluebird');
const monitor = require('pg-monitor');
const app = express();
const connectionString = `postgress://postgres@localhost:5432/l2`;
const port = 3000

// Part 1 username is ciara password is pass
// insert INTO users(name, password) VALUES('ciara', crypt('pass', gen_salt('bf', 8)));

massive(connectionString, {}, {
	promiseLib: promise}).then(db => {
  monitor.attach(db.driverConfig);

  /*db.query({
    'insert INTO users(name, password) VALUES('ciara', crypt('pass', gen_salt('bf', 8)));'
  })*/

  app.use(bp.json());

  app.get('/lab2', (req, res) => {
    res.json({
      message: 'Start of Lab2'
    });
  });

  app.post('/lab2/posts', verifyToken, (req, res) => {  

    //Checks the key
    jwt.verify(req.token, 'secretkey', (err, table) => {
      if(err) {
        res.sendStatus(403);
      } else {
        res.json({
          table
        });
      }
    });
  });

  app.post('/lab2/login', (req, res) => {

    //Need to check here that username and password is correct with database
    //hardcoded for now
    var username = req.params.username;
    var password = req.params.password;
  
    if(username == "ciara" && password == "pass")
    {
      //console.log("Works")
      res.json({ message: "You now have access to the database"});
    
    }

    // Mock user takes this data //should be products table
    const dummyUser = {
      id: 1, 
      username: 'ciarasas',
      email: 'ciarasas@gmail.com'
    }

    // Allow key to last for 24 hours // gives key token to you along with user data
    jwt.sign({dummyUser}, 'secretkey', { expiresIn: '1 day' }, (err, token) => {
      res.json({
        token
      });
    });
  
  });

  // Verify Token
  function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

  //HMAC Hashing
  //Get authorization header
  //const bearerHeader = req.headers['authorization'];

  //user passes a message
  //it will hash a message with a access key

  //compare hash message with header of postman

  app.post('/lab2/hash', (req, res) => {

    const headerAuth = req.headers.authorization;
    const accesskey = req.body.accesskey;
    
    //console.log("Test log");
    //console.log(req.body);
    const message = accesskey + req.body.message;

    console.log(message);
    // HMAC hashing key
    const crypto = require('crypto');

    const secret = 'abcdefg';

    const hash = crypto.createHmac('sha256', secret);
                      
    hash.update(message); //'This is a string that will be hashed'

    const readable = hash.digest('hex');

    console.log(readable);

    if(readable == headerAuth){
      //User is authenticated
      res.json({ message: "You now have access to the database"});
      //db.update({
        //Insert into table etc

      //});

    }else{
      //user isnt, throw error
      // Forbidden
      res.sendStatus(403);
    }
  });

});
app.listen(port, () => {
  console.log(`Listening on port ${port}!`)
});
