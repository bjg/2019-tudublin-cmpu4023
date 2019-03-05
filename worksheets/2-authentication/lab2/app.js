const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const massive = require('massive');
const bodyParser = require('body-parser');
var urlencodeds = bodyParser.urlencoded({extended: false});


// Similar to massive js example in the previous lab
massive({
    user: 'me',
    host: 'localhost',
    database: 'api',
    password: 'password',
    port: 5432,
  }).then(db => {
    // Testing basic operation
    app.get('/users', (req, res) => {
        db.users.find({}).then(user => res.json(user));
    })

    app.get('/products', (req, res) => {
        db.products.find({}).then(products => res.json(products));
    })

    // Login post tested with postman application
    app.post('/api/login', urlencodeds, (req, res) => {

        db.query('SELECT * FROM users where username = ${username} AND password = crypt(${password}, password);',
          {username: req.body.username,
           password: req.body.password}
        ).then(user => {
          if(user.length = 0){
            res.json({
              message: "Incorrect Credentials",
              status: 401
            })
          }else {
            let token = jwt.sign({user: req.body.username,
            },
            'secret', { expiresIn: '1h' });
              console.log("Sucress");

              res.json(token);
          }
        })
      
  });

  // Protected resource
  app.get('/api/products', verifyToken, (req, res) => {
    db.query('SELECT * FROM products'
  ).then(products => {
    if(products.length == 0) {
      res.json({
        message: "Not authorized",
        status: 401
      })
    } else {
      console.group("success")
      res.status(200).json(products);
    }
  })
  })
  })

  // Function to auth 
  function verifyToken(req, res, next) {
      let token;
      const headers = req.headers['authorization'];
      console.log(headers);
      if(typeof headers == "undefined"){
        res.json({
          messsage:"Token is not present",
          status: 401
        })
      } else {
        // Splitting the string bearer and the token
        const bearer = headers.split(' ');
        token = bearer[1];
        jwt.verify(token, 'secret', function(err, decoded){
            console.log("Somethign going on");

            if(err){
                req.authenticated = false;
                req.decoded = null; 
                res.sendStatus(401);
                console.log(" invalid token maybe change");
            } else {
              console.log(" Sucessful");
              req.decoded = decoded;
              req.authenticated = true;
              next();
            }
        })
      }
  }

app.listen(3000, ()  => console.log('Server started on prot 3000'));